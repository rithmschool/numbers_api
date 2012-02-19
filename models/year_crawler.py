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
	year_facts = {}
	# TODO: these seem to be the earliest and latest years that have entries per individual year.
	# check in more detail

	year_begin = -499
	year_end = 2059

	base_url = 'http://en.wikipedia.org/wiki'
	for year in xrange(year_begin, year_end + 1):

		categories = {
			'event': [],
			'birth': [],
			'death': [],
		}
		category_keys = categories.keys()

		try:

			if year < 0:
				url = '{0}/{1}_BC'.format(base_url, -year)
			else:
				url = '{0}/{1}'.format(base_url, year)
			print 'url is: ', url

			if year == 0:
				categories['event'].append('Is not a a year...For real.')
				year_facts[0] = categories

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

				found = False

				# we only want the bottom-most li (since it's possible than higher-level li's are for date, etc... splits)
				for e_li in tree.xpath('.//li[not(descendant::li)]'):

					e_title = idx(e_li.xpath(
						'./ancestor::ul[not(./ancestor::ul)]/preceding-sibling::h2[1]/span[@class="mw-headline"]'),
						0
					)
					if e_title is None or e_title.text is None:
						continue

					title = e_title.text.lower()
					for category_key in category_keys:
						if title.find(category_key) < 0:
							continue

						found = True
						categories[category_key].append(e_li.text_content())
						break

				if not found:
					error = 'No entries found for {0}'.format(year)
					errors.append(error)
					print error
				year_facts[year] = categories

			if year % ENTRIES_PER_FILE == 0 or year == year_end:
				range_end = int(math.ceil(float(year) / ENTRIES_PER_FILE)) * ENTRIES_PER_FILE
				range_begin = range_end - ENTRIES_PER_FILE + 1
				file_name = 'year/year_{0}_{1}.txt'.format(range_begin, range_end)
				print 'Writing to file: ', file_name
				try:
					f = open(file_name, 'w')
					try:
						f.write(json.dumps(year_facts, sort_keys=False))
					except Exception, e:
						error = 'Exception writing to file {0}: {1}'.format(file_name, e)
						errors.append(error)
						print error
						traceback.print_exc(file=sys.stdout)
					finally:
						f.close()

					year_facts = {}
				except Exception, e:
					error = 'Exception writing to file {0}: {1}'.format(file_name, e)
					errors.append(error)
					print error
					traceback.print_exc(file=sys.stdout)

		except Exception, e:
			error = 'Exception for {0}: {1}'.format(year, e)
			errors.append(error)
			print error
			traceback.print_exc(file=sys.stdout)

	message = StringIO.StringIO()
	message.write('Found {0} errors:\n'.format(len(errors)))
	for i in xrange(0, len(errors)):
		message.write('{0}: {1}:\n'.format(i, errors[i]))
	print message.getvalue()

	file_name = 'error/year_{0}.txt'.format(int(time.time()))
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

