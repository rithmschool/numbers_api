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

# capitalize start of each sentence
#def capitalize(str):
#	splits = re.split('([.!?] *)', str)
	return ''.join([split.capitalize() for split in splits])

def normalize():
	normalize_wikipedia_math()
	normalize_wikipedia_date()
	normalize_wikipedia_year()
	normalize_wikipedia_trivia()

def normalize_wikipedia_date():
	pass

def normalize_wikipedia_year():
	pass

def normalize_wikipedia_trivia():
	total = 0
	success = 0
	category = 'trivia'
	category_raw_path = '{0}/{1}'.format(category, 'raw')
	ignore_topics = ['birth', 'death']
	for filename in os.listdir(category_raw_path):

		if not filename.startswith('wikipedia_'):
			continue

		path = os.path.join(category_raw_path, filename)
		f = open(path, 'r')
		facts = json.load(f)
		f.close()

		all_flattened_facts = {}
		for number, number_facts in facts.items():
			all_flattened_facts[number] = []
			for topic, topic_items in number_facts.items():
				topic = topic.lower()
				ignore = False
				for ignore_topic in ignore_topics:
					if topic in ignore_topic:
						ignore = True
						break
				if ignore:
					continue

				for topic_item in topic_items:
					all_flattened_facts[number].append(topic_item)

		for flattened_facts in all_flattened_facts.values():
			total += len(flattened_facts)

		all_normalized_facts = normalize_wikipedia(all_flattened_facts)
		for normalized_facts in all_normalized_facts.values():
			success += len(normalized_facts)
		write_norm(all_normalized_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_wikipedia_math():
	total = 0
	success = 0
	category = 'math'
	category_raw_path = '{0}/{1}'.format(category, 'raw')
	for filename in os.listdir(category_raw_path):

		if not filename.startswith('wikipedia_'):
			continue

		path = os.path.join(category_raw_path, filename)
		f = open(path, 'r')
		facts = json.load(f)
		f.close()
		for number_facts in facts.values():
			total += len(number_facts)

		all_normalized_facts = normalize_wikipedia(facts)
		for normalized_facts in all_normalized_facts.values():
			success += len(normalized_facts)
		write_norm(all_normalized_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_wikipedia(facts):
	all_normalized_facts = {}

	for number, facts in facts.items():
		number = int(number)
		if number not in all_normalized_facts:
			all_normalized_facts[number] = []
		for fact in facts:

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

			# capitalize first letter it is a letter
			fact = fact.capitalize()

			# add ending period if necessary
			if fact[-1] != '.':
				fact = '{0}.'.format(fact)

			# only keep the first sentence if it has more than one sentence
			match = re.match('^(.*?\.) [A-Z]', fact)
			if match:
				fact = match.group(1)

			if len(fact) < 20 or len(fact) > 150:
				continue

			all_normalized_facts[number].append(fact)

			if fact != original_fact:
				# print diff
				pass

	return all_normalized_facts

def write_norm(facts, category, filename):
	category_norm_path = '{0}/{1}'.format(category, 'norm')
	path = os.path.join(category_norm_path, filename)
	f = open(path, 'w')
	json.dump(facts, f)
	print 'dumping to file', path
	f.close()

if __name__ == '__main__':
	normalize()
