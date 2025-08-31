-- Link existing words to themes by english_singular (id-agnostic). Safe to re-run.

-- Colors (theme_id = 2)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 2 FROM words WHERE english_singular IN (
  'red','blue','yellow','green','black','white','pink','purple','orange','brown','gray'
);

-- Stationery (theme_id = 4)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 4 FROM words WHERE english_singular IN (
  'pen','pencil','eraser','ruler','book','notebook','marker',
  'highlighter','crayon','colored pencil','paintbrush','scissors','stapler','staples',
  'paper clip','binder','folder','envelope','stamp','glue','tape','whiteboard',
  'chalk','blackboard','projector','screen','pointer','calendar','clock','calculator',
  'compass','protractor','dictionary','atlas','backpack','pencil case','lunch box'
);

-- Sports (theme_id = 3)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 3 FROM words WHERE english_singular IN (
  'basketball','soccer','baseball','tennis','badminton','swimming','running','jogging',
  'volleyball','table tennis','golf','hockey','rugby','cricket','boxing','wrestling',
  'karate','judo','taekwondo','cycling','skating','skiing','surfing','diving',
  'climbing','hiking','fishing','bowling','ping pong'
);

-- Fruits (theme_id = 5)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 5 FROM words WHERE english_singular IN (
  'apple','banana','orange','grape','guava','lemon','strawberry',
  'pear','peach','plum','cherry','apricot','mango','pineapple','watermelon',
  'cantaloupe','honeydew','kiwi','papaya','dragon fruit','lychee','longan',
  'rambutan','durian','jackfruit','breadfruit','fig','date','prune','raisin',
  'cranberry','blueberry','raspberry','blackberry','gooseberry','currant','mulberry',
  'persimmon','pomegranate','star fruit','custard apple','soursop','sapodilla','sugar apple'
);

-- Fast Food (theme_id = 6)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 6 FROM words WHERE english_singular IN (
  'hamburger','fries','pizza','hot dog','chicken nugget','soda'
);

-- Bakery & Snacks (theme_id = 7)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 7 FROM words WHERE english_singular IN (
  'bread','cake','cookie','donut','pie','candy'
);

-- Days of Week (theme_id = 8)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 8 FROM words WHERE english_singular IN (
  'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
);

-- Months (theme_id = 9)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 9 FROM words WHERE english_singular IN (
  'January','February','March','April','May','June','July','August','September','October','November','December'
);

-- School Subjects (theme_id = 10)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 10 FROM words WHERE english_singular IN (
  'math','science','English','history','geography','art','music','PE','Chinese',
  'social studies','computer science','physical education','home economics','library science',
  'cooking','drama','dance','band','choir','debate','journalism','yearbook',
  'newspaper','magazine','club','team','study group','tutoring','homework','assignment',
  'project','presentation','exam','test','quiz','final exam','midterm exam','pop quiz',
  'essay','research paper','book report','oral report','group project','individual project',
  'science fair','art show','talent show','spelling bee','math competition','science competition',
  'reading contest','writing contest','speech contest','debate tournament','chess tournament',
  'checkers tournament','board game tournament','card game tournament','video game tournament',
  'sports tournament','swimming meet','track meet','basketball game','soccer game','baseball game',
  'volleyball game','tennis match','badminton match','table tennis match','ping pong match',
  'golf tournament','hockey game','rugby match','cricket match','boxing match','wrestling match',
  'karate tournament','judo tournament','taekwondo tournament','cycling race','skating competition',
  'skiing competition','surfing competition','diving competition','climbing competition',
  'hiking trip','fishing trip','bowling game','ping pong game'
);

-- Countries (theme_id = 12)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 12 FROM words WHERE english_singular IN (
  'Taiwan','Japan','Korea','China','America','Canada','Australia','England',
  'France','Germany','Italy','Spain','Brazil','Mexico','India','Russia',
  'South Africa','Egypt','Thailand','Vietnam','Singapore','Malaysia','Philippines',
  'Indonesia','New Zealand','Ireland','Scotland','Wales','Netherlands','Belgium',
  'Switzerland','Austria','Poland','Czech Republic','Slovakia','Hungary','Romania',
  'Bulgaria','Greece','Turkey','Ukraine','Belarus','Latvia','Estonia','Lithuania',
  'Finland','Norway','Sweden','Denmark','Iceland','Portugal','Luxembourg','Monaco',
  'Vatican City','San Marino','Andorra','Liechtenstein','Malta','Cyprus','Croatia',
  'Slovenia','Serbia','Montenegro','Bosnia and Herzegovina','North Macedonia','Albania',
  'Kosovo','Moldova','Georgia','Armenia','Azerbaijan','Kazakhstan','Uzbekistan',
  'Turkmenistan','Kyrgyzstan','Tajikistan','Afghanistan','Pakistan','Bangladesh',
  'Sri Lanka','Nepal','Bhutan','Myanmar','Laos','Cambodia','Brunei','East Timor','Mongolia'
);

-- Drinks (theme_id = 15)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 15 FROM words WHERE english_singular IN (
  'water','milk','tea','juice','coffee','soda','hot chocolate','lemonade',
  'orange juice','apple juice','grape juice','coconut water','energy drink','smoothie',
  'milkshake','hot tea','iced tea','hot coffee','iced coffee','hot milk','chocolate milk',
  'strawberry milk','banana milk','almond milk','soy milk','rice milk','oat milk',
  'bubble tea','green tea','black tea','herbal tea','chamomile tea','mint tea',
  'ginger tea','honey tea','milk tea','fruit tea','espresso','cappuccino','latte',
  'mocha','americano','macchiato','frappuccino'
);

-- Main Dishes (theme_id = 16)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 16 FROM words WHERE english_singular IN (
  'rice','noodle','soup','salad','steak','fish','chicken','beef','pork','lamb',
  'duck','shrimp','crab','eggplant','tofu','pork chop','chicken wing','chicken leg',
  'chicken breast','beef stew','beef burger','beef noodle','beef curry','beef stir-fry',
  'beef soup','beef salad','beef sandwich','beef taco','beef burrito','beef pizza',
  'beef pasta','beef rice','beef noodle soup','beef curry rice','beef stir-fry rice',
  'beef salad rice','beef sandwich rice','beef taco rice','beef burrito rice',
  'beef pizza rice','beef pasta rice'
);

-- Furniture (theme_id = 13)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 13 FROM words WHERE english_singular IN (
  'chair','table','bed','desk','sofa','lamp','bookshelf','wardrobe','dresser',
  'nightstand','coffee table','dining table','stool','bench','cabinet','shelf',
  'rack','mirror','picture frame','vase','plant stand','footstool','ottoman',
  'armchair','recliner','bean bag','futon','bunk bed','twin bed','queen bed',
  'king bed','crib','playpen','high chair','booster seat','car seat','stroller',
  'baby carrier','baby swing','baby bouncer','baby walker','baby gym','baby mat',
  'baby blanket','baby pillow','baby towel','baby bath','baby potty','baby monitor',
  'baby gate','baby lock','baby proofing'
);

-- Ailments (theme_id = 11)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 11 FROM words WHERE english_singular IN (
  'headache','fever','cold','cough','sore throat','stomachache','toothache','earache',
  'backache','runny nose','sneezing','dizziness','insomnia','allergy','rash','bruise',
  'cut','burn','sprain','broken bone','infection','swelling','itch','blister',
  'scar','wound','nausea','vomiting','diarrhea','constipation','indigestion',
  'heartburn','acid reflux','ulcer','appendicitis','gallstones','kidney stones',
  'arthritis','diabetes','hypertension','asthma','pneumonia','bronchitis','sinusitis',
  'tonsillitis','otitis media','conjunctivitis','dermatitis','eczema','psoriasis',
  'acne','warts','moles','freckles','birthmarks','stretch marks','cellulite',
  'varicose veins','hemorrhoids','hernia','cataracts','glaucoma','macular degeneration',
  'retinal detachment','corneal abrasion','foreign body','chemical burn','electrical burn',
  'frostbite','heat stroke','heat exhaustion','hypothermia','dehydration','malnutrition',
  'obesity','anorexia','bulimia','binge eating disorder','orthorexia','pica',
  'rumination disorder','avoidant restrictive food intake disorder',
  'other specified feeding or eating disorder','unspecified feeding or eating disorder'
);

-- Ensure Numbers already handled separately (theme_id = 23)
-- No-op here to avoid duplication; use add-numbers-1-100.sql


