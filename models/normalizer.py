import os
import re
import json
import sys
import traceback
import num2eng

#Natural Language ToolKit Library
import nltk
from nltk.tag.simplify import simplify_wsj_tag

reload(sys)
sys.setdefaultencoding('utf-8')

def idx(obj, index, default=None):
	try:
		element = obj[index]
		return element
	except IndexError:
		return default

def get_words_tags(str):
	"""Tag words with its lexical category."""
	text = nltk.word_tokenize(str)
	word_tags = nltk.pos_tag(text)
	return [(word, simplify_wsj_tag(tag)) for word, tag in word_tags]

# capitalize start of each sentence
def capitalize_sentences(str):
	splits = re.split(r'([.!?] *)', str)
	return ''.join([split.capitalize() for split in splits])

# capitalize first letter of str
def capitalize_head(str):
	if not str:
		return str
	return str[0].upper() + str[1:]

def normalize():
	#normalize_efriedma_math()
	#normalize_wikipedia_math()
	normalize_wikipedia_trivia()
	#normalize_wikipedia_date()
	#normalize_wikipedia_year()

def flatten(path, ignore_topics):
	f = open(path, 'r')
	all_facts = json.load(f)
	f.close()

	all_flattened_facts = {}
	for number, facts in all_facts.items():
		all_flattened_facts[number] = []
		for topic, topic_items in facts.items():
			topic = topic.lower()
			ignore = False
			for ignore_topic in ignore_topics:
				if topic in ignore_topic:
					ignore = True
					break
			if ignore:
				continue

			for topic_item in topic_items:
				all_flattened_facts[number].append({'text': topic_item})

	return all_flattened_facts

def valid_wikipedia_file(filename):
	if not filename:
		return False
	if not filename.startswith('wikipedia_'):
		return False
	if filename.find('manual') !== 0:
		return False
	return True

def normalize_pre(all_facts):
	all_normalized_facts = {}
	for number, facts in all_facts.items():
		all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']
				# filters lexical token for the first word of text only
				text = nltk.sent_tokenize(text)[0]

				# strip leading and trailing whitespace
				text = text.strip()

				# remove "[<TEXT>]"
				text = re.sub(r'\[.*?\]', '', text)

				# remove multiple spaces in a row
				text = re.sub(r' +', ' ', text)

				text = capitalize_head(text)

				fact['text'] = text
				all_normalized_facts[number].append(fact)
			except Exception, e:
				print 'Error pre-parsing [{0}: {1}]: {2}'.format(number, fact['text'], e)
				#traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def normalize_wikipedia_date():
	total = 0
	success = 0
	category = 'date'
	category_raw_path = os.path.join(sys.path[0], category, 'raw')
	for filename in os.listdir(category_raw_path):

		if not valid_wikipedia_file(filename):
			continue

		path = os.path.join(category_raw_path, filename)
		all_facts = flatten(path, ['birth', 'death'])
		for facts in all_facts.values():
			total += len(facts)

		all_facts = normalize_pre(all_facts)
		all_facts = normalize_date(all_facts)
		all_facts = normalize_post(all_facts)
		for facts in all_facts.values():
			success += len(facts)
		write_norm(all_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_date(all_facts):
	all_normalized_facts = {}
	for number, facts in all_facts.items():
		all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']

				# should be of the format "<YEAR> [BC] - <TEXT>"
				# '\u2013' is a '-' (long dash) character
				match = re.match(ur'^(\d+) ?(BC)? ?\u2013 ?(.*)$', text)
				if not match:
					continue

				year = int(match.group(1))
				# matching "BC" means it's a negative year
				if match.group(2):
					year = -year

				# the <TEXT> part
				text = match.group(3)
				# remove hardcode, currently needed to speed things up
				words_tags = get_words_tags(text)

				if words_tags[0][1] != 'DET' and words_tags[0][1] != 'NP':
					# print 'date match failed: [{0}: {1}]'.format(number, fact['text'])
					continue

				if year:
					fact['year'] = year
					fact['pos'] = words_tags[0][1]
					fact['text'] = text
					all_normalized_facts[number].append(fact)

			except:
				print 'Error parsing date [{0}: {1}]'.format(number, fact['text'])
				traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def normalize_wikipedia_year():
	total = 0
	success = 0
	category = 'year'
	category_raw_path = os.path.join(sys.path[0], category, 'raw')
	for filename in os.listdir(category_raw_path):

		if not valid_wikipedia_file(filename):
			continue

		path = os.path.join(category_raw_path, filename)
		all_facts = flatten(path, ['birth', 'death'])
		for facts in all_facts.values():
			total += len(facts)

		# TODO: fix case of multiple entries under single date (prob is date is lost)
		all_facts = normalize_pre(all_facts)
		all_facts = normalize_year(all_facts)
		all_facts = normalize_post(all_facts)
		for facts in all_facts.values():
			success += len(facts)
		write_norm(all_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_year(all_facts):
	all_normalized_facts = {}
	for number, facts in all_facts.items():
		all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']
				# normalize sentence start
				# TODO: handle more than just articles
				match = re.match(ur'((.*?) \u2013 )?(.*)$', text)
				if not match:
					continue
				date = match.group(2)
				text = match.group(3)

				text = capitalize_head(text)
				# remove hardcode, currently needed to speed things up
				words_tags = get_words_tags(text)
				if words_tags[0][1] == 'DET' or words_tags[0][1] == 'NP':
					pass
				else:
					# print 'year match failed: [{0}: {1}]'.format(number, fact['text'])
					continue

				if date:
					fact['date'] = date
				fact['pos'] = words_tags[0][1]
				fact['text'] = text;
				all_normalized_facts[number].append(fact)

			except:
				print 'Error parsing year [{0}: {1}]'.format(number, fact['text'])
				traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def normalize_wikipedia_trivia():
	total = 0
	success = 0
	category = 'trivia'
	category_raw_path = os.path.join(sys.path[0], category, 'raw')
	for filename in os.listdir(category_raw_path):

		if not valid_wikipedia_file(filename):
			continue

		path = os.path.join(category_raw_path, filename)
		all_facts = flatten(path, ['birth', 'death'])
		for facts in all_facts.values():
			total += len(facts)

		all_facts = normalize_pre(all_facts)
		#all_facts = normalize_number(all_facts)
		all_facts = normalize_post(all_facts)
		for facts in all_facts.values():
			success += len(facts)
		write_norm(all_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_efriedma_math():
	total = 0
	success = 0
	category = 'math'
	filename = 'efriedma.txt'

	path = os.path.join(sys.path[0], category, 'raw', filename)
	f = open(path, 'r')
	temp_facts = json.load(f)
	f.close()

	all_facts = {}
	for number, fact in temp_facts.items():
		all_facts[number] = [{'text': fact}]
	total = len(all_facts)

	all_facts = normalize_pre(all_facts)
	all_facts = normalize_efriedma(all_facts)
	all_facts = normalize_post(all_facts)
	for facts in all_facts.values():
		success += len(facts)
	write_norm(all_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_efriedma(all_facts):
	all_normalized_facts = {}
	for number, facts in all_facts.items():
		all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']
				# TODO: be smarter with parsing
				text_lc = text.lower()
				# match 'is <FACT>' and '= <FACT>'
				match = re.match(r'^\s*(is |=\s*)([^\s].*)$', text, re.IGNORECASE)
				if not match:
					continue
				text = match.group(2)

				# manually set tag type of 'V', which is what nltk would return
				# TODO: do this in a cleaner way
				fact['pos'] = 'V'
				fact['text'] = capitalize_head(text)
				all_normalized_facts[number].append(fact)

			except:
				print 'Error parsing efriedma [{0}: {1}]'.format(number, fact['text'])
				traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def normalize_wikipedia_math():
	total = 0
	success = 0
	category = 'math'
	category_raw_path = os.path.join(sys.path[0], category, 'raw')
	for filename in os.listdir(category_raw_path):

		if not valid_wikipedia_file(filename):
			continue

		path = os.path.join(category_raw_path, filename)
		f = open(path, 'r')
		temp_facts = json.load(f)
		f.close()
		all_facts = {}
		for number, facts in temp_facts.items():
			total += len(facts)
			all_facts[number] = []
			for fact in facts:
				all_facts[number].append({'text': fact})

		all_facts = normalize_pre(all_facts)
		all_facts = normalize_number(all_facts)
		all_facts = normalize_post(all_facts)
		for facts in all_facts.values():
			success += len(facts)
		write_norm(all_facts, category, filename)

	print 'wikipedia {0}: success: {1}, total: {2}'.format(category, success, total)

def normalize_number(all_facts):
	all_normalized_facts = {}
	for number, facts in all_facts.items():
		all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']
				# normalize sentence start
				# TODO: only keep if it does not contain number further in the sentence
				# TODO: handle "In ..., # is ..."
				word_number = num2eng.num2eng(int(number))
				word_number = capitalize_head(word_number)
				text = capitalize_head(text)
				words_tags = get_words_tags(text)
				word_number_len = len(get_words_tags(word_number))
				#DET is determinator (lexical category)
				if words_tags[0][1] =='DET':
					offset = 0
				elif word_number and text.startswith(word_number) and words_tags[word_number_len][1] =='V':
					offset = word_number_len + 1
				elif (text.startswith(number) or words_tags[0][1] == 'PRO') and words_tags[1][1] == 'V':
					offset = 2
				else:
					continue
				regexp = r'^'
				for i in xrange(0, offset):
					regexp += r'.*?\s'
				text = re.sub(regexp, '', text)

				fact['pos'] = words_tags[offset][1]
				fact['text'] = capitalize_head(text)
				all_normalized_facts[number].append(fact)

			except:
				print 'Error parsing number [{0}: {1}]'.format(number, fact['text'])
				#traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def normalize_post(all_facts):
	all_normalized_facts = {}

	for number, facts in all_facts.items():
		if facts:
			all_normalized_facts[number] = []
		for fact in facts:
			try:
				text = fact['text']

				# ignore element if it contains : or \n as these indicate element is complex
				if text.find(':') >= 0 or text.find('\n') >= 0:
					continue

				#if len(text) < 20 or len(text) > 150:
				#	continue

				# capitalize beginning of sentence
				text = capitalize_head(text)

				# add ending period if necessary
				if text[-1] != '.':
					text = text + '.'

				# see if the number itself appears in the fact
				# TODO: should use regexp for this matching to handle word boundary
				text_lc = text.lower()
				word_number_lc = num2eng.num2eng(int(number)).lower()
				if text_lc.find(number) >= 0 or (word_number_lc and text_lc.find(word_number_lc) >= 0):
					fact['self'] = True
				else:
					fact['self'] = False

				fact['manual'] = False
				fact['text'] = text
				all_normalized_facts[number].append(fact)

			except:
				print 'Error post-parsing [{0}: {1}]'.format(number, fact['text'])
				traceback.print_exc(file=sys.stdout)

	return all_normalized_facts

def write_norm(facts, category, filename):
	path = os.path.join(sys.path[0], category, 'norm', filename)
	f = open(path, 'w')
	json.dump(facts, f)
	print 'dumping to file', path
	f.close()

# TODO: support normalizing specific files via command line arguments
if __name__ == '__main__':
	normalize()
