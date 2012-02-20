# crawl Wikipedia for dates

import os
import re
import json
import sys
import num2eng

reload(sys)
sys.setdefaultencoding('utf-8')

#import StringIO
#import time
#import calendar
#import sys
#import traceback
#from pprint import pprint

ENTRIES_PER_FILE = 100

def idx(obj, index):
	try:
		element = obj[index]
		return element
	except IndexError:
		return None

def capitalize(str):
	splits = re.split('([.!?] *)', str)
	return ''.join([split.capitalize() for split in splits])

def normalize():
	# TODO: remove hack

	math = 'math'
	trivia = 'trivia'
	date = 'date'
	year = 'year'

	wikipedia = 'wikipedia_'

	total = 0
	success = 0

	math_raw_path = 'math/{0}'.format('raw')
	for filename in os.listdir(math_raw_path):
		if not filename.startswith(wikipedia):
			continue

		path = os.path.join(math_raw_path, filename)
		f = open(path, 'r')
		numbers_facts = json.load(f)
		f.close()

		normalized_facts = {}

		for number, facts in numbers_facts.items():
			number = int(number)
			if number not in normalized_facts:
				normalized_facts[number] = []
			for fact in facts:

				total += 1

				if not fact:
					continue

				original_fact = fact

				# strip leading and trailing whitespace
				fact = fact.strip()

				# capitalize beginning of sentence
				fact = fact.capitalize()

				# normalize sentence start
				# TODO: only keep if it does not contain number further in the sentence
				# TODO: handle "In ..., # is ..."
				word_number = num2eng.num2eng(number)
				word_number = word_number.capitalize()
				if (fact.startswith('{0} is'.format(number)) or
						fact.startswith('{0} has'.format(number)) or
						fact.startswith('It is') or
						fact.startswith('It has')):
					fact = re.sub('^\w+ ', '', fact)
				elif (fact.startswith('The'.format(number)) or
						fact.startswith('A'.format(number)) or
						fact.startswith('An'.format(number))):
					fact = '{0} {1}{2}'.format('Is', fact[0].lower(), fact[1:])
				elif (fact.startswith('{0} is'.format(word_number)) or
						fact.startswith('{0} has'.format(word_number))):
					fact = fact[len(word_number)+1:]
				else:
					continue

				# remove "[<TEXT>]"
				fact = re.sub('\[.*?\]', '', fact)

				# ignore element if it contains : or \n as these indicate element is complex
				if fact.find(':') >= 0 or fact.find('\n') >= 0:
					continue

				# capitalize first letter
				if fact[0].isalpha():
					fact = fact.capitalize()

				# capitalize first letter
				if fact[0].isalpha():
					fact = capitalize(fact)

				# add ending period if necessary
				if fact[-1] != '.':
					fact = '{0}.'.format(fact)

				# only keep the first sentence if it has more than one sentence
				match = re.match('^(.*?\.) [A-Z]', fact)
				if match:
					fact = match.group(1)

				if len(fact) < 20 or len(fact) > 150:
					continue

				normalized_facts[number].append(fact)
				success += 1

				if fact != original_fact:
					# print diff
					pass

		math_norm_path = 'math/{0}'.format('norm')
		path = os.path.join(math_norm_path, filename)
		f = open(path, 'w')
		json.dump(normalized_facts, f)
		print 'Dumping to file', path
		f.close()

	print 'success:', success, 'total:', total


if __name__ == '__main__':
	normalize()
