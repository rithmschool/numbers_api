# crawl Wikipedia for dates

import math
import StringIO
import time
import calendar
import json
import sys
import traceback
from pprint import pprint
from lxml import html

ENTRIES_PER_FILE = 100

def idx(obj, index):
	try:
		element = obj[index]
		return element
	except IndexError:
		return None

# TODO: support updating just specific years
def crawl():
	# lxml.parse seems faster than requests.get from testing
	#r = requests.get('http://en.wikipedia.org/wiki/May_24')
	#pprint(('status_code', r.status_code))
	#pprint(('content_type', r.headers['content-type']))
	#pprint(('text', r.text))
	#tree = etree.parse(StringIO.StringIO(r.text), parser)

	#parser = etree.HTMLParser()

	errors = []
	math_facts = {}
	trivia_facts = {}
	# TODO: these seem to be the earliest and latest years that have entries per individual year.
	# check in more detail

	number_begin = -1
	number_end = 277

	# convert to lowercase; needed for xpath 1.0
	x_lc = 'translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")'
	# matches parent ul
	x_ul = '/ancestor::ul'
	# matches first h2 tag that is sibling of current tag
	x_h2 = '/preceding-sibling::h2[1]/span'

	# matches uppermost li or p (since math facts use p and li interchangeably)
	x_math_item = './/p | .//li[not(./ancestor::li)]'
	# matches h2 if the current ul if it is 'math'
	x_math_ul = '.{0}{1}[@class="mw-headline" and contains({2}, "math")]'.format(x_ul, x_h2, x_lc)
	# matches h2 if the current p if it is 'math'
	x_math_p = '.{0}[@class="mw-headline" and contains({1}, "math")]'.format(x_h2, x_lc)

	# matches uppermost li
	x_trivia_item = './/li[not(./ancestor::li)]'
	# matches h2 of the current ul if it does not contains 'math', 'note', 'reference'
	x_trivia = '.{0}{1}[@class="mw-headline" and not(contains({2}, "math")) and not(contains({2}, "note")) and not(contains({2}, "reference"))]'.format(x_ul, x_h2, x_lc)

	base_url = 'http://en.wikipedia.org/wiki'
	for number in xrange(number_begin, number_end + 1):

		try:

			url = '{0}/{1}_(number)'.format(base_url, number)
			print 'url is: ', url

			categories = {}

			found_math = False
			found_trivia = False

			if number == -1:
				math_facts[-1] = ['The first number less than 0']
				categories['other'] = ['Negative one']
				trivia_facts[0] = categories
				found_math = True
				found_trivia = True
			if number == 0:
				math_facts[0] = ['A number that is neither positive nor negative']
				categories['other'] = ['Zero']
				trivia_facts[0] = categories
				found_math = True
				found_trivia = True

			else:

				tries = 0
				while True:
					try:
						tree = html.parse(url)
						break
					except:
						wait = 2 ** (tries + 1)
						print 'Exception while parsing. Sleeping for {0} secs'.format(wait)
						time.sleep(wait)
						tries += 1
						if tries == 5:
							raise

				# find math facts
				math_fact = []
				for e_item in tree.xpath(x_math_item):
					if e_item.tag == 'p':
						e_title = e_item.xpath(x_math_p)
					else:
						e_title = e_item.xpath(x_math_ul)

					e_title = idx(e_title, 0)
					if e_title is None or e_title.text is None:
						continue

					math_fact.append(e_item.text_content())
					found_math = True

				# find trivia facts
				categories = {}
				for e_item in tree.xpath(x_trivia_item):

					e_title = e_item.xpath(x_trivia)
					e_title = idx(e_title, 0)
					if e_title is None or e_title.text is None:
						continue

					title = e_title.text.lower()
					if title not in categories:
						categories[title] = []
					categories[title].append(e_item.text_content())
					found_trivia = True

			if not found_math:
				error = 'No math entries found for {0}'.format(number)
				errors.append(error)
				print error

			math_facts[number] = math_fact
			if not found_trivia:
				error = 'No trivia entries found for {0}'.format(number)
				errors.append(error)
				print error
			trivia_facts[number] = categories

			if number % ENTRIES_PER_FILE == 0 or number == number_end:
				range_end = int(math.ceil(float(number) / ENTRIES_PER_FILE)) * ENTRIES_PER_FILE
				range_begin = range_end - ENTRIES_PER_FILE + 1

				file_name = 'math/math_{0}_{1}.txt'.format(range_begin, range_end)
				print 'Writing to file: ', file_name
				f = open(file_name, 'w')
				try:
					f.write(json.dumps(math_facts, sort_keys=False))
				except Exception, e:
					error = 'Exception writing to file {0}: {1}'.format(file_name, e)
					errors.append(error)
					print error
					traceback.print_exc(file=sys.stdout)
				finally:
					f.close()
					math_facts = {}

				file_name = 'trivia/trivia_{0}_{1}.txt'.format(range_begin, range_end)
				print 'Writing to file: ', file_name
				f = open(file_name, 'w')
				try:
					f.write(json.dumps(trivia_facts, sort_keys=False))
				except Exception, e:
					error = 'Exception writing to file {0}: {1}'.format(file_name, e)
					errors.append(error)
					print error
					traceback.print_exc(file=sys.stdout)
				finally:
					f.close()
					trivia_facts = {}

		except Exception, e:
			error = 'Exception for {0}: {1}'.format(number, e)
			errors.append(error)
			print error
			traceback.print_exc(file=sys.stdout)

	message = StringIO.StringIO()
	message.write('Found {0} errors:\n'.format(len(errors)))
	for i in xrange(0, len(errors)):
		message.write('{0}: {1}:\n'.format(i, errors[i]))
	print message.getvalue()

	file_name = 'error/number_{0}.txt'.format(int(time.time()))
	f = open(file_name, 'w')
	try:
		f.write(message.getvalue())
	except Exception, e:
		print 'Exception writing to file {0}: {1}'.format(file_name, e)
		traceback.print_exc(file=sys.stdout)
	finally:
		f.close()

if __name__ == '__main__':
	crawl()
