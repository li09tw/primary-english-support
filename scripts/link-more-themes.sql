-- Link additional themes by english_singular; safe to re-run (INSERT OR IGNORE)

-- Identity (theme_id = 18)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 18 FROM words WHERE english_singular IN (
  'father','mother','brother','sister','grandfather','grandmother','uncle','aunt','cousin','friend','classmate'
);

-- Professions (theme_id = 19)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 19 FROM words WHERE english_singular IN (
  'student','teacher','doctor','nurse','farmer','police officer','firefighter','chef','cook','engineer','artist','singer','driver','worker','dentist','actor','actress','writer','pilot','mail carrier','salesperson','scientist','vet','cleaner','guard','coach'
);

-- Daily Actions (theme_id = 20)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 20 FROM words WHERE english_singular IN (
  'wake up','get up','brush teeth','wash face','eat','drink','go to school','walk','run','read','write','draw','study','listen','speak','play','do homework','sleep'
);

-- Clothing (theme_id = 21)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 21 FROM words WHERE english_singular IN (
  'shirt','T-shirt','pants','shorts','skirt','dress','jacket','coat','hat','cap','shoes','socks','gloves','scarf','sweater','uniform'
);

-- Buildings & Places (theme_id = 22)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 22 FROM words WHERE english_singular IN (
  'school','park','library','hospital','post office','police station','fire station','restaurant','supermarket','store','bank','museum','zoo','airport','bus stop','station','home','house','temple','church'
);

-- Ailments (theme_id = 11)
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 11 FROM words WHERE english_singular IN (
  'headache','stomachache','toothache','fever','cold','cough','sore throat','runny nose'
);


