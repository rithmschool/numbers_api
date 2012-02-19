# crawl Wikipedia for dates

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

# TODO: support updating just specific dates
def crawl():
	# lxml.parse seems faster than requests.get from testing
	#r = requests.get('http://en.wikipedia.org/wiki/May_24')
	#pprint(('status_code', r.status_code))
	#pprint(('content_type', r.headers['content-type']))
	#pprint(('text', r.text))
	#tree = etree.parse(StringIO.StringIO(r.text), parser)

	#parser = etree.HTMLParser()

	errors = []
	date_facts = {}
	month_names = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	base_url = 'http://en.wikipedia.org/wiki'
	counter = 0
	for month in xrange(1, len(month_names) + 1):

		month_name = month_names[month-1]
		leap_year = 2012
		days = calendar.monthrange(leap_year, month)[1]

		for day in xrange(1, days+1):

			# if month != 7 or day != 11: continue

			categories = {
				'event': [],
				'birth': [],
				'death': [],
				'holiday': [],
			}
			category_keys = categories.keys()

			try:

				url = '{0}/{1}_{2}'.format(base_url, month_name, day)
				print 'url is: ', url

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

				for e in tree.iterfind('.//h2'):
					e_title = idx(e.xpath('./span[@class="mw-headline"]'), 0)
					if e_title is None or e_title.text is None:
						continue

					title = e_title.text.lower()
					for category_key in category_keys:
						if title.find(category_key) < 0:
							continue

						e_ul = idx(e.xpath('./following-sibling::ul[1]'), 0)
						if e_ul is None:
							break

						for e_li in e_ul:
							#print(e_li.text_content())
							found = True
							categories[category_key].append(e_li.text_content())

						break

				date_key = '{0}/{1}'.format(month, day)
				if not found:
					error = 'No entries found for {0}'.format(date_key)
					errors.append(error)
					print error
				date_facts[date_key] = categories

				counter += 1
				# TODO: fix: see year_crawler.py
				if counter % ENTRIES_PER_FILE == 0 or (month == 12 and day == 31):
					range_end = int(math.ceil(float(counter) / ENTRIES_PER_FILE)) * ENTRIES_PER_FILE
					range_begin = range_end - ENTRIES_PER_FILE + 1
					file_name = 'date/date_{0}_{1}.txt'.format(range_begin, range_end)
					print 'Writing to file: ', file_name
					try:
						f = open(file_name, 'w')
						try:
							f.write(json.dumps(date_facts, sort_keys=False))
						except Exception, e:
							error = 'Exception writing to file {0}: {1}'.format(file_name, e)
							errors.append(error)
							print error
							traceback.print_exc(file=sys.stdout)
						finally:
							f.close()

						date_facts = {}
					except Exception, e:
						error = 'Exception writing to file {0}: {1}'.format(file_name, e)
						errors.append(error)
						print error
						traceback.print_exc(file=sys.stdout)

			except Exception, e:
				error = 'Exception for {0}/{1}: {2}'.format(month, day, e)
				errors.append(error)
				print error
				traceback.print_exc(file=sys.stdout)

	message = StringIO.StringIO()
	message.write('Found {0} errors:\n'.format(len(errors)))
	for i in xrange(0, len(errors)):
		message.write('{0}: {1}:\n'.format(i, errors[i]))
	print message.getvalue()

	file_name = 'error/date_{0}.txt'.format(int(time.time()))
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

