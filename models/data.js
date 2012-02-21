var _ = require('underscore');
var fs = require('fs');

function reader(out, path, callback) {
  // TODO: more reliable checking if file is data file
  var files = fs.readdirSync(path);

  console.log('files: ', files);

  _.each(files, function(file) {
    // TODO: add encoding argument
    // TODO: fix directory so it's relative to directory of this file
    try {
      var data = fs.readFileSync(path + file);
    } catch (e) {
      console.error('Exception while reading file ', path + file, ': ', e.message);
      return;
    }

    try {
      var numbers = JSON.parse(data);
    } catch (e) {
      console.error('Exception while parsing file', path + file, ': ',  e.message);
      return;
    }

    // TODO: There should be a try/catch around this
    _.each(numbers, function(number_data, number_key) {
      float_key = parseFloat(number_key, 10);
      if (isNaN(float_key)) {
        console.log('Skipping invaid number_key', number_key, 'in file', path + file);
        return;
      }

      // TODO: handle this during normalization
      if (!number_data || number_data.length === 0) {
        // console.log('Skipping empty number_data for float_key', float_key, 'in file', path + file);
        return;
      }

      if (!(float_key in out)) {
        out[float_key] = [];
      }
      var o = out[float_key];

      _.each(number_data, function(element) {
				if (!element.text || !element.text.length) {
					console.log('Skipping empty file (element.text is falsey)', path + file);
					return;
				}
        // check if fact contains the number itself and discard it
        if (callback) {
          element = callback(element);
        }
        if (!element) {
          return;
        }
        if (element.text.length < 20 || element.text.length > 100) {
          return;
        }
        o[o.length] = element;
      });
      if (o.length === 0) {
        delete out[float_key];
      }
    });
  });
}

exports.date = {};
reader(exports.date, 'models/date/norm/', function(element) {
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  if (element.date) {
    text = 'The day in ' + element.date + ' that ' + text;
  } else {
    text = 'The day that ' + text;
  }
  element.text = text + '.';
  return element;
});

exports.year = {};
reader(exports.year, 'models/year/norm/', function(element) {
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  text = 'The year that ' + text;
  if (element.date) {
    text += ' on ' + element.date;
  }
  element.text = text + '.';
  return element;
});

exports.trivia = {};
var trivia_path = 'models/trivia/';
reader(exports.trivia, 'models/trivia/norm/', function(element) {
  var text = element.text;
  text = text.substring(0, text.length-1);
  element.text =  'Trivia: ' + text + '.';
  return element;
});

exports.math = {};
reader(exports.math, 'models/math/norm/', function(element) {
  // do not return results that contain the number itself
  if (element.self) {
    return null;
  }
  var text = element.text;
  text = text.substring(0, text.length-1);
  if (element.pos !== 'NP') {
    text = text[0].toLowerCase() + text.substring(1);
  }
  element.text =  'Is ' + text + '.';
  return element;
});

exports.year = {
		129: 'Emperor Hadrian continues his voyages, now inspecting Caria, Cappadocia and Syria',
		130: 'Claudius Ptolemaeus tabulates angles of refraction for several media',
		131: 'Emperor Hadrian builds the city Aelia Capitolina on the location of Jerusalem',
		132: 'Chinese scientist Zhang Heng invents the first seismometer for determining the exact cardinal direction of earthquakes hundreds of miles away',
		133: 'Sextus Julius Severus, governor of Britain, is sent to Judea (from 136 renamed Syria Palaestina) to quell a revolt',
		134: 'a university of rhetoric, law and philosophy, the Athenaeum, opens in Rome',
		135: 'Epictetus writes the Enchiridion (approximate date)',
		136: 'The war against the Suebi begins',
		137: 'Wang Yun, Chinese Prime Minister, plotted Dong Zhuo\'s assassination and was successful',
		138: 'the silver content of the Roman denarius falls to 75 percent under emperor Antoninus Pius, down from 87 percent under the reign of Hadrian',
		139: 'Marcus Aurelius is named Caesar. He marries Faustina the Younger, daughter of Antoninus Pius',
		140: 'Ptolemy completes his Almagest (approximate date)',
		162: 'Parthian War with Rome begins',
		163: 'Statius Priscus reconquers Armenia; Artaxata is ruined',
		164: 'In Rome, a law is passed protecting property brought into a marriage by the wife',
		165: 'Dura-Europos is taken by the Romans',
		166: 'Dacia is invaded by barbarians',
		167: 'The Germans devastate the Balkans and ransack the sanctuary of Eleusis, near Athens',
		168: 'Emperor Marcus Aurelius and his stepbrother Lucius Verus leave Rome, and establish their headquarters at Aquileia',
		169: 'Lucian demonstrates the absurdity of fatalism',
		170: 'The fundamental works of Ptolemy on cartography are published',
		171: 'Armenia and Mesopotamia becomes a protectorate of the Roman Empire',
		172: 'Montanism spreads through the Roman Empire',
		173: 'Given control of the Eastern Empire, Avidius Cassius, the governor of Syria, crushes an insurrection of shepherds known as the boukoloi',
		174: 'Meditations by Marcus Aurelius is written, in Greek, while on military campaigns',
		175: 'Confucian scholars try to ensure their capacity in the royal court of China. They are massacred by the eunuchs',
		176: 'Equestrian Statue of Marcus Aurelius is made. It is now kept at Museo Capitolini in Rome (approximate date)',
		177: 'Second Marcomannic War: Marcus Aurelius and Commodus begin war against the Quadi and the Marcomanni',
		180: 'Galen\'s popular work on hygiene is published',
		181: 'The volcano associated with Lake Taupo in New Zealand erupts, one of the largest on Earth in the last 5,000 years. The effects of this eruption are seen as far away as Rome and China',
		182: 'Emperor Commodus escapes death at the hands of assassins, who have attacked him at the instigation of his sister Lucilla and a large group of senators. He puts many distinguished Romans to death on charges of being implicated in the conspiracy, Lucilla is exiled to Capri',
		184: 'the Yellow Turban Rebellion and Liang Province Rebellion break out in China',
		185: 'a supernova now known as SN 185 is noted by Chinese astronomers in the Astrological Annals of the Houhanshu, making it the earliest recorded supernova',
		186: 'the Hatepe volcanic eruption extends Lake Taupo and makes skies red across the world',
		187: 'Clodius Albinus defeats the Chatti, a highly organized German tribe that controlled the area that includes the Black Forest',
		188: 'Queen Himiko (aka, Pimiko) is said to have begun her reign in Japan',
		189: 'Galen publishes his "Treatise on the various temperaments" (aka On the Elements According to Hippocrates)',
		190: 'Cleomedes teaches that the moon does not glow on its own, but rather reflects sunlight',
		191: 'Chinese warlords formes a coalition force and launches a punitive campaign against Chancellor Dong Zhuo. He forced Emperor Xian to move to Chang\'an (modern Xi\'an) and burns the capital Luoyang',
		192: 'December 31 – Emperor Commodus alarms the Senate by appearing dressed as a gladiator for his new consulship (January 1). His mistress, Marcia, finds her name on the imperial execution list and hires the champion wrestler named Narcissus to assassinate Commodus. The Antonines dynasty ends',
		193: 'The silver content of the Roman denarius falls to 50 percent under emperor Septimius Severus, down from 68 percent under Marcus Aurelius',
		194: 'Galen writes his manual on pathology, The Art of Curing',
		195: 'Emperor Septimius Severus has the Senate deify Commodus in an attempt to gain favor with the family of Marcus Aurelius',
		196: 'Emperor Septimius Severus captures and sacks Byzantium, the city is rebuilt and regains its previous prosperity',
		197: 'Galen\'s major work on medicines, Pharmacologia, is published',
		198: 'Publius Septimius Geta, son of Septimus Severus, receives the title of Caesar',
		199: 'Emperor Septimius Severus lays siege to the city-state Hatra in Central-Mesopotamia, but fails to capture the city despite breaching the walls',
		200: 'human population reaches about 257 million',
		201: 'Osroene becomes the first state which adopts Christianity as its official religion (per New International Encyclopedia)',
		202: 'Rome establishes medical licenses, awarded only to trained physicians who have passed examinations. Medical societies and civic hospitals are set up, and laws are passed to govern the behavior of medical students. They are prohibited from visiting brothels',
		203: 'Emperor Septimius Severus rebuilds Byzantium.',
		204: 'A trade recession in the Leptis Magna region (Africa) is alleviated by emperor Septimius Severus, he buys up the country\'s olive oil for free distribution in Rome',
		205: 'Hadrian\'s Wall is restored, after heavy raids by Caledonian tribes had overrun much of northern Britain',
		207: 'Cao Cao defeats the Wuhuan tribes at the Battle of White Wolf Mountain, sending the Wuhuan into decline',
		208: 'Emperor Septimius Severus leads an expedition (20,000 men) in Britannia, crosses Hadrian\'s Wall and moves through eastern Scotland. The Roman army pushes the Caledonians back to the River Tay and Severus signs a peace treaty. He repairs the Antonine Wall (his repairs are sometimes called the Severan Wall)',
		209: 'Severus makes plans to subdue the land to the north of Scotland, ravaging it severely. Road-building and forest-clearing, the Roman army reaches Aberdeen. The Scottish tribes begin guerrilla warfare against the Romans',
		210: 'Having suffered heavy losses since invading Scotland in 208, emperor Septimius Severus makes peace with the Scots',
		211: 'Emperor Septimius Severus falls ill and dies in Britain after an 18-year reign. He is later deified by the Senate',
		212: 'The edict of emperor Caracalla (Constitutio Antoniniana) extends Roman citizenship to all free inhabitants of the Roman Empire with the exception of a limited group that may include Egyptians. The Jewish people are among those who receive citizenship',
		213: 'Cao Cao, the prime minister of the Han dynasty, is titled Wei Gong (Duke of Wei) and given a fief of ten cities under his domain. This later becomes the Kingdom of Wei',
		214: 'Caracalla\'s victories in Germany ensure his popularity within the Roman army.',
		215: 'Caracalla\'s troops massacre the population of Alexandria, Egypt, beginning with the leading citizens. The emperor is angry about a satire, produced in Alexandria, mocking his claim that he killed Geta in self-defense.',
		216: 'Emperor Caracalla tricks the Parthians by accepting a marriage proposal. He slaughters his bride and the wedding guests after the celebrations',
		217: 'Summer – Battle of Nisibis: The Roman army under command of Macrinus, is defeated in a three days battle by the Parthians at Nisibis (southern Turkey)',
		218: 'May 16 – Julia Maesa, an aunt of the assassinated Caracalla, is banished to her home in Syria by the self-proclaimed emperor Macrinus and declares her grandson Elagabalus, age 14, emperor of Rome',
		219: 'Julia Maesa arranges for her grandson Elagabalus a marriage with Julia Paula. The wedding is a lavish ceremony and Paula is given the honorific title of Augusta',
		220: 'Elagabalus divorces Julia Paula and marries Aquilia Severa, a Vestal Virgin. The wedding causes a enormous controversy – traditionally, the punishment for breaking celibacy is death by being buried alive',
		221: 'July – Elagabalus is forced to divorce Aquilia Severa and marries his third wife Annia Faustina. After five months he returns to Severa and claims that the original divorce is invalid. The marriage is symbolic, because Elagabalus appears to be homosexual or bisexual. According to the historian Cassius Dio, he has a stable relationship with his chariot driver, the slave Hierocles',
		222: 'Three Kingdoms: Eastern Wu is established in China. Emperor Liu Bei invades with a army (100,000 men) the border of Eastern Wu in the Battle of Yiling to retake the Jing province. However, because of a tactical mistake, Liu Bei\'s military camps are destroyed by forces of Sun Quan.',
		223: 'Three Kingdoms: Emperor Liu Bei of the Shu Han becomes ill and dies at Baidicheng. He is succeeded by his son, Liu Shan. Imperial Chancellor, Zhuge Liang, makes peace with the Wu Empire',
		224: 'King Ardashir I defeats Artabanus IV at Hormizdegan (modern Shushtar), destroying the Parthian Empire and establishing the Sassanid dynasty. Artabanus\'s brother Vologases VI will continue to rule with Armenian and Kushan support over outlying parts of Parthia.',
		225: 'Emperor Alexander Severus marries Sallustia Orbiana, and possibly raises her father Seius Sallustius to the rank of caesar',
		226: 'A merchant from the Roman Empire called "Qin Lun" by the Chinese, arrives in Jiaozhi (modern Hanoi) and is taken to see Sun Quan, king of Eastern Wu, who requests him to make a report on his native country and people. He is given an escort for the return trip including a present of ten male and ten female "blackish-coloured dwarfs." However, the officer in charge of the Chinese escort dies and Qin Lun has to continue his journey home alone',
		227: 'Seius Sallustius is executed for the attempted murder of his son-in-law Emperor Alexander Severus. Sallustius\' daughter, as well Alexander\'s wife, Sallustia Orbiana, is exiled in Libya',
		228: 'The Praetorian Guard kill Ulpian, Praetorian prefect, who had wanted to reduce their privileges',
		229: 'Ammonius Saccas renews Greek philosophy by creating Neoplatonism',
		230: 'Alexander Severus assembled the Roman army and establish his headquarters at Antioch. He makes an attempt for diplomatic solutions, but the Persians decline and choose for war',
		231: 'Emperor Alexander Severus accompanied his mother Julia Mamaea to Syria and campaigns against the Persians. Military command rests in the hands of his generals, but his presence gives additional weight to the empire\'s policy.',
		232: 'Roman–Persian Wars: Emperor Alexander Severus launches a three-pronged counterattack against the Persian forces of king Ardashir I, who have invaded Mesopotamia. However, the Roman army advancing through Armenia is halted. Alexander gives the order to march to the capital at Ctesiphon, but the Romans are defeated and withdraw to Syria. The result is a acceptance of the status quo and after heavy losses on both sides, a truce is signed',
		233: 'Emperor Alexander Severus celebrates a triumph in Rome to observe his "victory" the previous year over the Persians. He is soon summoned to the Rhine frontier, where the Alamanni invade Swabia. German tribes destroy Roman forts and plunder the countryside at the Limes Germanicus',
		234: 'Zhuge Liang, Chancellor of Shu Han, embarks on his last Northern Expedition against Cao Wei. During the Battle of Wuzhang Plains, he falls sick and sends secret orders for his army to retreat',
		235: 'March 20 – Maximinus Thrax, age 62, is proclaimed emperor. He has a Gothic father and an Alan mother. Maximinus a Thracian, is the first foreigner to hold the Roman throne',
		236: 'The Roman Senate appoints a twenty-man committee to co-ordinate operations against Maximinus',
		237: 'Emperor Maximinus Thrax campaigns on the rivers Danube and Rhine in Germania, defeating the Alemanni and never visits Rome. He is accepted by the Roman Senate, but taxes the rich aristocracy heavily and engenders such hostility among them that they plot against him',
		238: 'July 29 – The Praetorian Guard stormed the palace and capture Pupienus and Balbinus. They are dragged naked through the streets of Rome and executed. On the same day Gordian III, age 13, is proclaimed new emperor. Timesitheus becomes his tutor and advisor',
		239: 'A Chinese expeditionary force discovers the island of Taiwan',
		240: 'The Roman Empire is threatned on several fronts at the same time. Africa revolts and tribes in northwest Germania, under the name of the Franks, are raiding the Rhine frontier',
		241: 'Winter – Emperor Gordian III reaches Antioch and prepares with his army an offensive against the Persians',
		242: 'Emperor Gordian III begins a campaign against king Shapur I, the Greek philosopher Plotinus joins him and hopes to obtain first-hand knowledge of Persian and Indian philosophies',
		243: 'Timesitheus becomes ill and dies under suspicious circumstances. Shapur I retreats to Persia, giving up all the territories he conquered',
		244: 'Plotinus, Greek philosopher, escapes the bloodshed that accompanies the murder of Gordianus III and makes his way to Antioch. Back to Rome he founds his Neoplatonist school and attracts students like Porphyry, Castricius Firmus and Eustochius of Alexandria',
		245: 'Trieu Thi Trinh, a Vietnamese warrior, begins her three year resistance against the invading Chinese',
		246: 'Emperor Philip the Arab fights the Germans along the Danube',
		247: 'the Goths appear on the lower Danube frontier, they invade the Ukraine and Romania',
		248: 'The Roman Empire continues the celebration of the 1,000th anniversary of the city of Rome, with the ludi saeculares, organized by Philip the Arab',
		249: 'Trajan Decius puts down a revolt in Moesia and Pannonia. Loyal legionaries proclaim him emperor and he leads them into Italy. At a battle at Verona, he defeats and kills Philip the Arab',
		250: 'Diophantus writes Arithmetica, the first systematic treatise on algebra',
		251: 'A fifteen-year plague begins in the Roman Empire',
		252: 'Valerian reforms Legio III Augusta to fight the "five peoples", a dangerous coalition of Berber tribes in Africa',
		253: 'Battle of Barbalissos: King Shapur I, defeats the Roman army (70,000 men) under Valerianus I at Barbalissos in Syria',
		254: 'Publius Licinius Valerianus Augustus and Publius Licinius Egnatius Gallienus become Roman Consuls.',
		255: 'Ma Jun, a Chinese mechanical engineer from Cao Wei, invents the South Pointing Chariot, a path-finding directional compass vehicle that uses a differential gear, not magnetics',
		256: 'the great pandemic of the Roman world strikes violently in Pontus on the Black Sea and causes enormous loss of life in Alexandria, encouraging thousands to embrace Christianity',
		257: 'The Goths separate into the Ostrogoths and the Visigoths',
		258: 'Nanjing University is founded in Nanjing, China',
		259: 'Emperor Valerian leads an army (70,000 men) to relieve Edessa, besieged by the forces of king Shapur I. An outbreak of a plague kills many legionaries, weakening the Roman position in Syria',
		260: 'Earliest known date of chess',
		261: 'Roman-Persian Wars: Balista, Roman usurper, collects ships from Cilician ports and defeats the Persian fleet near Pompeiopolis, capturing the harem of king Shapur I',
		262: 'The Heruls accompanied the Goths ravaging the coasts of the Black Sea and the Aegean',
		263: 'Liu Hui writes a commentary on The Nine Chapters on the Mathematical Art, describing what will later be called Gaussian elimination, computing pi, etc.',
		264: 'Jiang Wei tries to restore the Kingdom of Shu by persuading Zhong Hui to declare a rebellion against Sima Zhao, ruler of Cao Wei. They receive no support from the Wei troops, and Zhong Hui, Jiang Wei and their families are put to death',
		265: 'Jin Wudi becomes ruler of part of China, beginning the Jin Dynasty. He establishes his capital at Luoyang and gives princes of his uncles, cousins, brothers, and sons, independent military commands in the Chinese Empire',
		266: 'King Odaenathus of Palmyra invades Persia to conquer the capital Ctesiphon. After his victories in the East he pronouns himself with the title "king of kings"',
		267: 'Aureolus, charged with defending Italy, defeats Victorinus (co-emperor of Gaul), is proclaimed emperor by his troops, and begins his march on Rome',
		268: 'Gallienus is killed by his own senior officers at Mediolanum (Milan) while besieging his rival Aureolus, one of the Thirty Tyrants. Aureolus is murdered in turn by the Praetorian guard',
		269: 'The Heruli capture Athens and raid the Aegean Islands as far as Crete and Rhodes',
		270: 'The Chinese invent gunpowder (black powder), a mixture of sulfur, charcoal and potassium nitrate. At first, it appears to have been used only for fireworks',
		271: 'A magnetic compass is first used in China',
		272: 'During the Siege of Tyana, Emperor Aurelian has a dream of Apollonius of Tyana and spares the city',
		273: 'Aurelian increases Rome\'s daily bread ration to nearly 1.5 pounds and adds pig fat to the list of foods distributed free to the populace',
		274: 'Japanese shipwrights build a 100-foot oar-powered vessel for Emperor Ōjin. The Japanese will not use sails for another 7 centuries',
		275: 'September 25 – Marcus Claudius Tacitus is proclaimed Emperor by the Senate, his half brother Marcus Annius Florianus becomes Praetorian Prefect',
		276: 'Reign of Mahasena in Ceylon. Orthodox and unpopular, he tries to introduce Mahayana Buddhism to the country',
		277: 'Probus enters Rome to have his position as Emperor ratified by the Senate',
		278: 'Piracy along the coast of Lycia and Pamphylia. The Romans besiege the city of Cremna (Pisidia) and killed the Isaurian robber Lydius',
		279: 'Emperor Probus defeats the Burgundians and Vandals in Raetia and Pannonia (modern Switzerland and Hungary)',
		280: 'The Greek mathematician Pappus demonstrates geometrically the property of the center of gravity',
		281: 'Emperor Probus returns to Rome, where he celebrates his triumph over the Vandals and the usurpers (Bonosus, Julius Saturninus and Proculus)',
		282: 'Emperor Probus travels towards Sirmium (Serbia). He tries to employ his troops in peaceful projects as draining the swamps in Pannonia',
		283: 'Carus dies in mysterious circumstances during an expedition against the Sassanids, during a violent dust storm he is killed by a stroke of lightning',
		284: 'Gaius Aurelius Valerius Diocletianus, age 39, is proclaimed new emperor. He establish himself at Nicomedia (modern İzmit, Turkey) and accepts the purple imperial vestments',
		285: 'Carausius, naval commander at Bononia (modern Boulogne), is given the task to clear the English Channel of Frankish and Saxon pirates',
		286: 'Diocletian divides the empire in two, after economic and military problems. He gives Maximian control over the Western Roman Empire and appoints himself ruler of the Eastern Roman Empire (later known as the Byzantine Empire)',
		287: 'Diocletian re-organized the Mesopotamian frontier and fortifies the city of Circesium (modern Busayrah) on the Euphrates',
		288: 'Emperor Diocletian conducts a military campaign in Raetia (Switzerland)',
		289: 'Maximian attempts to reconquer Britain from the usurper Carausius, but fails due to bad weather. He loses his fleet and accepts a peace treaty',
		290: 'Carausius begins to build a series of fortifications on the Saxon Shore in south-east England',
		291: 'Emperor Diocletian signs peace treaties with the kingdoms of Aksum and Nubia',
		292: 'Achilleus, Roman general, is proclaimed emperor in Alexandria. For two years he rules over Egypt, but in the end the rebellion is crushed by Emperor Diocletian',
		293: 'King Bahram II of the Persian Empire dies after a 17-year reign, his son Bahram III ascends to the throne. After four months he is murdered by viceroy Narseh with support of the nobility',
		294: 'Galerius is given the unspectacular job of land reclamation and repopulation, moving the entire tribe of the Carpi to settlements within the Roman Empire',
		295: 'Galerius, Roman Caesar in the Balkan, is dispatched to Egypt to fight against the rebellious cities Busiris and Coptos',
		296: 'Constantius Chlorus reconquers Britain, he rebuilds the cities Eboracum (York), Londinium (London), and Verulamium (St Albans)',
		297: 'Emperor Maximian begins a offensive against the Berbers in Mauritania, driving them back into their homelands in the Atlas Mountains. He spends the rest of the winter in Carthage (Africa)',
		298: 'The manufacture of cultured silk becomes popular from Korea to Japan',
		299: 'Galerius commissions the Arch of Galerius in Thessaloniki (Greece). The structure is built to celebrate the war and victory over the Sassanid Persians',
		300: 'The elephant becomes extinct in North Africa (approximate date)',
}

*/
