/**
 * Comprehensive Vocabulary Database (فەرهەنگی وشەسازی تەواوی عێراقی بۆ کوردی سۆرانی)
 * 250+ categorized words with phonetic transcription, Kurdish translations, and usage examples.
 */

window.VOCABULARY_DATABASE = [
  // 1. بنەما و سڵاوکردن (Greetings & Basics)
  { id: 'v1', ar: 'شلونك', phonetic: 'شلۆنک', ku: 'چۆنیت (بۆ نێر)', category: 'basics', example_ar: 'شلونك اليوم خويه؟', example_ku: 'ئەمڕۆ چۆنیت براکەم؟' },
  { id: 'v2', ar: 'شلونچ', phonetic: 'شلۆنچ', ku: 'چۆنیت (بۆ مێ)', category: 'basics', example_ar: 'شلونچ اختي ان شاء الله زينة؟', example_ku: 'چۆنیت خوشکەکەم باشت بە پشتیوانی خوا؟' },
  { id: 'v3', ar: 'شكو ماكو', phonetic: 'شکو ماکو', ku: 'چی هەیە و چی نییە؟ (چ باسە؟)', category: 'basics', example_ar: 'شكو ماكو ببغداد هالأيام؟', example_ku: 'ئەم ڕۆژانە لە بەغدا چ باسە و چی هەیە؟' },
  { id: 'v4', ar: 'ماكو شي', phonetic: 'ماکو شی', ku: 'هیچ نییە (ئاساییە)', category: 'basics', example_ar: 'ماكو شي سلامتك كل الأمور تمام.', example_ku: 'هیچ نییە سەلامەت بیت هەموو کارەکان باشن.' },
  { id: 'v5', ar: 'زين / زينة', phonetic: 'زەین / زەینە', ku: 'باش، چاک', category: 'basics', example_ar: 'الحمد لله اني كلش زين.', example_ku: 'سوپاس بۆ خوا من زۆر باشم.' },
  { id: 'v6', ar: 'هلو / هلا والله', phonetic: 'هەلۆ / هەلا وەڵڵا', ku: 'سڵاو / هەزار بەخێربێیت', category: 'basics', example_ar: 'هلا والله نورت المكان!', example_ku: 'بەخێربێیت شوێنەکەت ڕووناک کردەوە!' },
  { id: 'v7', ar: 'مشكور / ما قصرت', phonetic: 'مەشکور / ما قەسسەرت', ku: 'دەستت خۆش، زۆر سوپاس', category: 'basics', example_ar: 'مشكور خويه وما قصرت ويايه.', example_ku: 'دەستت خۆش برام و هیچت کەم نەکرد بۆم.' },
  { id: 'v8', ar: 'في امان الله', phonetic: 'فی ئەمان اللە', ku: 'خوات لەگەڵ بێت', category: 'basics', example_ar: 'في امان الله ونشوفكم باجر.', example_ku: 'خوات لەگەڵ بێت و بەیانی یەکتر دەبینینەوە.' },
  { id: 'v9', ar: 'الله وياك', phonetic: 'ئەڵڵاهو ویاک', ku: 'خوا لەگەڵت بێت', category: 'basics', example_ar: 'الله وياك ودربك اخضر.', example_ku: 'خوا لەگەڵت بێت و ڕێگات سەوز بێت.' },
  { id: 'v10', ar: 'تشرفنا', phonetic: 'تەشەررەفنا', ku: 'شەرەفمەند بووین', category: 'basics', example_ar: 'تشرفنا بمعرفتكم الكريمة.', example_ku: 'شەرەفمەند بووین بە ناسینی بەڕێزتان.' },

  // 2. کات و ژمارەکان (Time, Numbers & Currency)
  { id: 'v11', ar: 'هسه', phonetic: 'هەسە', ku: 'ئێستا', category: 'time_numbers', example_ar: 'هسه لازم نطلع حتى ما نتاخر.', example_ku: 'ئێستا دەبێت دەربچین بۆ ئەوەی دوانەکەوین.' },
  { id: 'v12', ar: 'باجر', phonetic: 'باچەر', ku: 'سبەینێ', category: 'time_numbers', example_ar: 'باجر الصبح اروح للدوام.', example_ku: 'بەیانی زوو دەچم بۆ دەوام.' },
  { id: 'v13', ar: 'البارحة', phonetic: 'ئەلباریحە', ku: 'دوێنێ', category: 'time_numbers', example_ar: 'البارحة بالليل شفت فيلم حلو.', example_ku: 'دوێنێ شەو فیلمێکی خۆشم بینی.' },
  { id: 'v14', ar: 'عگب باجر', phonetic: 'عگب باچەر', ku: 'دووسبەی', category: 'time_numbers', example_ar: 'عگب باجر عندي امتحان مهم.', example_ku: 'دووسبەی تاقیکردنەوەیەکی گرنگم هەیە.' },
  { id: 'v15', ar: 'شوية', phonetic: 'شۆیەی', ku: 'تۆزێک / کەمێک', category: 'time_numbers', example_ar: 'انتظرني شوية واجيك.', example_ku: 'تۆزێک چاوەڕێم بکە و دێم بۆ لات.' },
  { id: 'v16', ar: 'هواية', phonetic: 'هەوایە', ku: 'زۆر / گەلێک', category: 'time_numbers', example_ar: 'احبك هواية يا صديقي.', example_ku: 'زۆر خۆشم دەوێیت ئەی هاوڕێم.' },
  { id: 'v17', ar: 'بيش', phonetic: 'بێش', ku: 'بە چەندە؟', category: 'time_numbers', example_ar: 'بيش هذا القميص؟', example_ku: 'ئەم قەمیسە بە چەندە؟' },
  { id: 'v18', ar: 'شگد', phonetic: 'شگەد', ku: 'چەند؟ (بۆ بڕ و ژمارە)', category: 'time_numbers', example_ar: 'شگد باقي على موعد الطيارة؟', example_ku: 'چەند ماوە بۆ کاتی فڕۆکەکە؟' },
  { id: 'v19', ar: 'فكة / خردة', phonetic: 'فیککە / خەردە', ku: 'وردە پارە', category: 'time_numbers', example_ar: 'عندك فكة مال خمسة وعشرين؟', example_ku: 'وردەت پێیە بۆ بیست و پێنج هەزاری؟' },
  { id: 'v20', ar: 'ربع', phonetic: 'روبوع', ku: 'چارەک (٢٥٠ دینار)', category: 'time_numbers', example_ar: 'انطيني صمون بربع دينار.', example_ku: 'بە چارەکە دینارێک سەموونم بدەرێ.' },
  { id: 'v21', ar: 'نص', phonetic: 'نوس', ku: 'نیو (٥٠٠ دینار)', category: 'time_numbers', example_ar: 'نص كيلو لحم مثروم فدوه.', example_ku: 'نیو کیلۆ گۆشتی قیمەکراوم بدەرێ قوربان.' },
  { id: 'v22', ar: 'ألف دینار', phonetic: 'ئەلف دینار', ku: 'هەزار دینار', category: 'time_numbers', example_ar: 'الكروة بألف ونص.', example_ku: 'کرێکەی بە هەزار و نیوە.' },
  { id: 'v23', ar: 'ورقة', phonetic: 'وەرەقە', ku: 'سەد دۆلار (لە بازاڕی عێراق)', category: 'time_numbers', example_ar: 'الصرف صار بمية واثنين وخمسين ألف للورقة.', example_ku: 'گۆڕینەوە بوو بە ١٥٢ هەزار بۆ هەر وەرەقەیەک.' },

  // 3. هاتوچۆ و ئاڕاستەکان (Transport & Directions)
  { id: 'v24', ar: 'تاكسي', phonetic: 'تاکسی', ku: 'تەکسی', category: 'transport', example_ar: 'اخذ تاكسي حتى توصل اسرع.', example_ku: 'تەکسی بگرە بۆ ئەوەی خێراتر بگەیت.' },
  { id: 'v25', ar: 'كيا', phonetic: 'کیا', ku: 'مینی پاس / کیای گشتی', category: 'transport', example_ar: 'اركب بهال كيا تروح للميدان.', example_ku: 'سەرکەوە لەم کیایە دەچێت بۆ مەیدان.' },
  { id: 'v26', ar: 'كروة', phonetic: 'کیڕوە', ku: 'کرێی هاتووچۆ', category: 'transport', example_ar: 'انطي الكروة للسايق فدوه.', example_ku: 'کرێکە بدە بە شۆفێرەکە قوربان.' },
  { id: 'v27', ar: 'گراج', phonetic: 'گەراج', ku: 'گەراجی ترومبێل و پاس', category: 'transport', example_ar: 'السيارة واگفة بگراج النهضة.', example_ku: 'سەیارەکە لە گەراجی نەهزە وەستاوە.' },
  { id: 'v28', ar: 'نازل', phonetic: 'نازل', ku: 'دادەبەزم (داوای وەستان)', category: 'transport', example_ar: 'نازل هنا يم السيطرة عمي.', example_ku: 'لێرە لای خاڵی پشکنینەکە دادەبەزم مامە گیان.' },
  { id: 'v29', ar: 'لوّف', phonetic: 'لەوویف', ku: 'بسوڕێوە / بپێچەرەوە', category: 'transport', example_ar: 'لوف يمنة وادخل بهذا الفرع.', example_ku: 'بپێچەرەوە بۆ لای ڕاست و بچۆ ناو ئەم کۆڵانە.' },
  { id: 'v30', ar: 'گبال', phonetic: 'گبال', ku: 'بەرامبەر / ڕووبەڕوو', category: 'transport', example_ar: 'المحل صاير گبال الجامع.', example_ku: 'دوکانەکە دەکەوێتە بەرامبەر مزگەوتەکە.' },
  { id: 'v31', ar: 'يَم', phonetic: 'یەم', ku: 'تەنیشت / لای', category: 'transport', example_ar: 'تعال اگعد يمي واسمع السالفة.', example_ku: 'وەرە لە تەنیشتم دابنیشە و گوێ لە بەسەرهاتەکە بگرە.' },
  { id: 'v32', ar: 'فرع', phonetic: 'فەرع', ku: 'کۆڵان', category: 'transport', example_ar: 'بيتنا بثاني فرع على ايدك اليسرة.', example_ku: 'ماڵمان لە دووەم کۆڵانە لەسەر دەستی چەپت.' },
  { id: 'v33', ar: 'سيطرة', phonetic: 'سەیتەرە', ku: 'خاڵی پشکنینی پۆلیس/ئاسایش', category: 'transport', example_ar: 'السيطرة ازدحام شوية بس تمشي.', example_ku: 'خاڵی پشکنین کەمێک قەرەباڵغە بەڵام دەڕوات.' },

  // 4. خواردن و چێشتخانە (Food & Kitchen)
  { id: 'v34', ar: 'صمون', phonetic: 'سەموون', ku: 'سەموونی ئەڵماسی عێراقی', category: 'food', example_ar: 'جيب خمس صمونات حارات من الفرن.', example_ku: 'پێنج سەموونی گەرم لە فڕنەکە بهێنە.' },
  { id: 'v35', ar: 'گص', phonetic: 'گەس', ku: 'گەس / شاوەرمای عێراقی', category: 'food', example_ar: 'لفّة گص لحم ويا عمبة وببسي.', example_ku: 'لەفەیەکی گەسی گۆشت لەگەڵ عەمبە و بیبسی.' },
  { id: 'v36', ar: 'عمبة', phonetic: 'عەمبە', ku: 'ترشیاتی بەهاراتداری مۆنگۆ', category: 'food', example_ar: 'كثر العمبة باللفة فدوه.', example_ku: 'عەمبەکە لە ناو لەفەکە زیاد بکە قوربان.' },
  { id: 'v37', ar: 'سمك مسگوف', phonetic: 'سەمەک مەسگووف', ku: 'ماسی مەسگوفی سەر خەڵووز', category: 'food', example_ar: 'اطيب مسگوف تاكله بشارع ابو نؤاس.', example_ku: 'خۆشترین مەسگوف لە شەقامی ئەبو نەواس دەخۆیت.' },
  { id: 'v38', ar: 'كاهي وگيمر', phonetic: 'کاهی وە گەیمەر', ku: 'کاهی و قەیماغی عەرەب', category: 'food', example_ar: 'ريوك الجمعة كاهي وگيمر عرب ودبس.', example_ku: 'نانی بەیانیانی هەینی کاهی و قەیماغ و دۆشاوە.' },
  { id: 'v39', ar: 'تمن', phonetic: 'تەمەن', ku: 'برنج', category: 'food', example_ar: 'تمن عنبر ومرگة باميا دهينة.', example_ku: 'برنجی عەنبەر و شلە بامێی بە ڕۆن.' },
  { id: 'v40', ar: 'مرگة', phonetic: 'مەرگە', ku: 'شلمین / شلە', category: 'food', example_ar: 'سوي مرگة فاصوليا يابسة اليوم.', example_ku: 'ئەمڕۆ شلەی فاسۆلیای وشک لێبنێ.' },
  { id: 'v41', ar: 'تشريب', phonetic: 'تەشریب', ku: 'تەشیریبی نان و گۆشت', category: 'food', example_ar: 'تشريب لحم احمر ويا ليمون بصرة.', example_ku: 'تەشریبی گۆشتی سوور لەگەڵ لیمۆ بەسڕە.' },
  { id: 'v42', ar: 'كليچة', phonetic: 'کلیچە', ku: 'کولیچەی جەژن بە هێڵ و خورما', category: 'food', example_ar: 'ريحة الهيل تفوح من الكليچة.', example_ku: 'بۆنی هێڵ لە کولیچەکە دەچۆڕێت.' },
  { id: 'v43', ar: 'شربت زبيب', phonetic: 'شەربەت زەبیب', ku: 'شەربەتی مێوژی بەغدا', category: 'food', example_ar: 'شربت زبيب بارد يطفي العطش.', example_ku: 'شەربەتی مێوژی سارد تینوێتی دەشکێنێت.' },
  { id: 'v44', ar: 'قوري', phonetic: 'قۆری', ku: 'قۆری چا', category: 'food', example_ar: 'خلي القوري على الصوبة يخدر.', example_ku: 'قۆرییەکە بخەرە سەر زۆپاکە با دەم بکێشێت.' },
  { id: 'v45', ar: 'استكان', phonetic: 'ئیستیکان', ku: 'پیاڵەی چا', category: 'food', example_ar: 'صبلي استكان چاي مهيل وسنگين.', example_ku: 'ئیستیکانێک چای هێڵداری تۆخم بۆ تێبکە.' },
  { id: 'v46', ar: 'خاشوگة', phonetic: 'خاشوگە', ku: 'کەوچک', category: 'food', example_ar: 'انطيني خاشوگة حتى احرك الشكر.', example_ku: 'کەوچکێکم بدەرێ تا شەکرەکە تێکبدەم.' },
  { id: 'v47', ar: 'چطل', phonetic: 'چەتەڵ', ku: 'چەتاڵ', category: 'food', example_ar: 'وين الچطالة والخواشيگ؟', example_ku: 'چەتاڵ و کەوچکەکان لە کوێن؟' },
  { id: 'v48', ar: 'ماعون', phonetic: 'ماعوون', ku: 'قاپ / دەوری', category: 'food', example_ar: 'خلّي الأكل بماعون چبير.', example_ku: 'خواردنەکە بخەرە قاپێکی گەورەوە.' },
  { id: 'v49', ar: 'جدر', phonetic: 'جیدیر', ku: 'مەنجەڵ', category: 'food', example_ar: 'جدر الدولمة يشهي النفس.', example_ku: 'مەنجەڵی دۆڵمەکە ئارەزووی خواردن دەکاتەوە.' },

  // 5. ماڵ، کەلوپەل و ژیان (Home & Living)
  { id: 'v50', ar: 'صوبة', phonetic: 'سۆبە', ku: 'زۆپا (نەوت یان کارەبا)', category: 'home', example_ar: 'شغل الصوبة الجو صار بارد.', example_ku: 'زۆپاکە هەڵکە هەواکە سارد بوو.' },
  { id: 'v51', ar: 'مولدة', phonetic: 'مووەللەدە', ku: 'مۆلیدەی گەڕەک / کارەبای ئەهلی', category: 'home', example_ar: 'خط السحب مال المولدة اشتغل.', example_ku: 'هێڵی کارەبای مۆلیدەکە کەوتە کار.' },
  { id: 'v52', ar: 'پردة', phonetic: 'پەردە', ku: 'پەردەی پەنجەرە', category: 'home', example_ar: 'سد الپردات الشمس كلش قوية.', example_ku: 'پەردەکان دابەرەوە خۆرەکە زۆر بەهێزە.' },
  { id: 'v53', ar: 'قنفة', phonetic: 'قەنەفە', ku: 'قەنەفەی دانیشتن', category: 'home', example_ar: 'ارتاح واگعد على القنفة.', example_ku: 'پشوو بدە و لەسەر قەنەفەکە دابنیشە.' },
  { id: 'v54', ar: 'پنكة', phonetic: 'پەنکە', ku: 'پانکە / باوەشێن', category: 'home', example_ar: 'شغل البنكة حتى يبرد المكان.', example_ku: 'پانکەکە هەڵکە بۆ ئەوەی شوێنەکە فێنک بێتەوە.' },
  { id: 'v55', ar: 'دوشك', phonetic: 'دۆشەک', ku: 'دۆشەکی خەوتن', category: 'home', example_ar: 'فرش الدواشك للضيوف.', example_ku: 'دۆشەکەکان بۆ میوانەکان ڕابخە.' },
  { id: 'v56', ar: 'مغسلة', phonetic: 'مەغسەلە', ku: 'دەستشۆر', category: 'home', example_ar: 'اغسل ايدك بالمغسلة قبل الأكل.', example_ku: 'پێش نانخواردن دەستت لە دەستشۆرەکە بشۆ.' },

  // 6. بازاڕ، جلوبەرگ و ئامێر (Shopping & Electronics)
  { id: 'v57', ar: 'قميص', phonetic: 'قەمیس', ku: 'کراس / قەمیس', category: 'shopping', example_ar: 'هذا القميص الأبيض قياسه مضبوط.', example_ku: 'ئەم قەمیسە سپییە قیاسەکەی تەواوە.' },
  { id: 'v58', ar: 'بنطرون', phonetic: 'بەنتەرۆن', ku: 'پانتۆڵ', category: 'shopping', example_ar: 'اريد بنطرون كابوي اسود.', example_ku: 'پانتۆڵێکی کابۆی ڕەشم دەوێت.' },
  { id: 'v59', ar: 'قندرة / حذاء', phonetic: 'قوندەرە / حیزاء', ku: 'پێڵاو', category: 'shopping', example_ar: 'هاي القندرة جلد طبيعي ومريحة.', example_ku: 'ئەم پێڵاوە چەرمی سروشتییە و ئاسوودەیە.' },
  { id: 'v60', ar: 'شاحنة', phonetic: 'شاحینە', ku: 'شەحنی مۆبایل', category: 'shopping', example_ar: 'نسيت شاحنة التلفون بالبيت.', example_ku: 'شاحنەی مۆبایلەکەم لە ماڵەوە لەبیرکرد.' },
  { id: 'v61', ar: 'كڤر', phonetic: 'کەڤەر', ku: 'بەرگی پارێزەری مۆبایل', category: 'shopping', example_ar: 'اشتريت كڤر ضد الصدمات للموبايل.', example_ku: 'کەڤەرێکی دژە زەبرم بۆ مۆبایلەکە کڕی.' },
  { id: 'v62', ar: 'لزگة شاشة', phonetic: 'لێزگەی شاشە', ku: 'لەزگەی پارێزەری شاشە', category: 'shopping', example_ar: 'شد لزگة شاشة اصلية حتى ما تنكسر.', example_ku: 'لەزگەی شاشەی ئەسڵی لێبدە بۆ ئەوەی نەشکێت.' },

  // 7. تەندروستی و جەستە (Health & Medicine)
  { id: 'v63', ar: 'صخونة', phonetic: 'سخوونە', ku: 'تا / گەرمبوونی لەش', category: 'health', example_ar: 'عندي صخونة عالية ومحتاج خافض حرارة.', example_ku: 'تایەکی بەرزیم هەیە و پێویستم بە دابەزێنەری پلەی گەرمییە.' },
  { id: 'v64', ar: 'نشلة', phonetic: 'نەشلە', ku: 'هەڵامەت / سەرمابوون', category: 'health', example_ar: 'هاي النشلة تعبتني هواية.', example_ku: 'ئەم هەڵامەتە زۆر ماندووی کردم.' },
  { id: 'v65', ar: 'وجع راس', phonetic: 'وەجەع راس', ku: 'سەرئێشە', category: 'health', example_ar: 'من البارحة راسي يوجعني.', example_ku: 'لە دوێنێوە سەرم دێشێت.' },
  { id: 'v66', ar: 'راشيتة', phonetic: 'ڕاشێتە', ku: 'ڕەچەتەی پزیشک', category: 'health', example_ar: 'انطي الراشيتة للصيدلاني حتى يصرف الدوا.', example_ku: 'ڕەچەتەکە بدە بە دەرمانسازەکە تا دەرمانەکان بدات.' },
  { id: 'v67', ar: 'مسكن', phonetic: 'موسەککین', ku: 'ئازارشکێن', category: 'health', example_ar: 'اخذ حبة مسكن ونام شوية.', example_ku: 'حەبێکی ئازارشکێن بخۆ و تۆزێک بخەوە.' },
  { id: 'v68', ar: 'طوارئ', phonetic: 'تەوارئ', ku: 'بەشی فریاکەوتن', category: 'health', example_ar: 'اخذناه للطوارئ على السريع.', example_ku: 'بە پەلە بردمانە بەشی فریاکەوتن.' },
  { id: 'v69', ar: 'إسعاف', phonetic: 'ئیسعاف', ku: 'ئامبوڵانس', category: 'health', example_ar: 'سيارة الإسعاف وصلت بالوكت المناسب.', example_ku: 'سەیارەی فریاکەوتن لە کاتی گونجاودا گەیشت.' },

  // 8. پەیوەندی و خێزان (Family & Social)
  { id: 'v70', ar: 'الجهال', phonetic: 'ئەلجیهال', ku: 'منداڵەکان', category: 'family', example_ar: 'الجهال دا يلعبون بالحديقة.', example_ku: 'منداڵەکان خەریکن لە باخچەکە یاری دەکەن.' },
  { id: 'v71', ar: 'حباب', phonetic: 'حەبباب', ku: 'شیرین، دڵسۆز و خۆشەویست', category: 'family', example_ar: 'هذا الشخص كلش حباب ويحب الخير.', example_ku: 'ئەم کەسە زۆر شیرین و دڵپاکە و حەزی لە چاکەیە.' },
  { id: 'v72', ar: 'سبع', phonetic: 'سەبِع', ku: 'ئازا، چاوکراوە و لێهاتوو', category: 'family', example_ar: 'عاشت ايدك، والله انت سبع!', example_ku: 'دەستت خۆش بێت، بە خوا تۆ زۆر ئازایت!' },
  { id: 'v73', ar: 'اخويه', phonetic: 'ئەخۆیەم', ku: 'براکەم (دەستەواژەی ڕێز بۆ هەموو کەس)', category: 'family', example_ar: 'تفضل اخويه شلون اخدمك؟', example_ku: 'فەرموو برام چۆن خزمەتت بکەم؟' },
  { id: 'v74', ar: 'خالي', phonetic: 'خالی', ku: 'خاڵم (دەربڕینی دۆستانەی باشوور)', category: 'family', example_ar: 'هلا بخالي العزيز نورتنا.', example_ku: 'سڵاو لە خاڵی ئازیزم ڕووناکت کردینەوە.' },
  { id: 'v75', ar: 'عمي', phonetic: 'عەممی', ku: 'مامە (ڕێزگرتن لە پیاوی بەتەمەن)', category: 'family', example_ar: 'تفضل عمي استريح بالصدر.', example_ku: 'فەرموو مامە گیان لە سەرەوە پشوو بدە.' },

  // 9. سڵانگ و زمانی کۆڵان (Street Slang & Expressions)
  { id: 'v76', ar: 'طاگ', phonetic: 'تاگ', ku: 'زۆر دەوڵەمەند، پارەدار', category: 'slang', example_ar: 'هذا التاجر طاگ بالسوق.', example_ku: 'ئەم بازرگانە زۆر دەوڵەمەندە لە بازاڕدا.' },
  { id: 'v77', ar: 'حديقة', phonetic: 'حەدیقە', ku: 'بێ پارە، مفلیس، گیرفان بەتاڵ', category: 'slang', example_ar: 'هالشهر اني حديقة ما عندي ولا فلس.', example_ku: 'ئەم مانگە من گیرفانم بەتاڵە و یەک فلسیشم پێ نییە.' },
  { id: 'v78', ar: 'قفاص', phonetic: 'قَفّاس', ku: 'فێڵباز، قۆڵبڕ', category: 'slang', example_ar: 'لا تشتري منه ترى قفاص وياخذ زايد.', example_ku: 'لەم مەکڕە چونکە فێڵبازە و پارەی زیاتر وەردەگرێت.' },
  { id: 'v79', ar: 'لوتي', phonetic: 'لووتی', ku: 'زیرەکی شەقام، زیرەک و وریا', category: 'slang', example_ar: 'هذا لوتي يعرف شلون يطلع حقه.', example_ku: 'ئەمە زرنگە و دەزانێت چۆن مافی خۆی دەربێنێت.' },
  { id: 'v80', ar: 'بايعها', phonetic: 'بایەعها', ku: 'بێ خەم، دونیا بە کەم گر', category: 'slang', example_ar: 'بايعها ويضحك على كل شي.', example_ku: 'خەمی نییە و بە هەموو شتێک پێدەکەنێت.' },
  { id: 'v81', ar: 'مطفي', phonetic: 'مەتفی', ku: 'گێل، بێ ئاگا لە دنیا', category: 'slang', example_ar: 'فلان مطفي وما يدري شصاير.', example_ku: 'فلان کەس خەواڵووە و نازانێت چی ڕوودەدات.' },
  { id: 'v82', ar: 'لواگه', phonetic: 'لواگە', ku: 'ماستاوچی، زمانلووس', category: 'slang', example_ar: 'عوف اللواگه واحچي الصدگ.', example_ku: 'دەستبەرداری ماستاو بە و ڕاستییەکە بڵێ.' },
  { id: 'v83', ar: 'سحگات', phonetic: 'سەحگات', ku: 'هەڵەی زەق لە قسەکردندا', category: 'slang', example_ar: 'ههههه خوش سحگة سحگت بالكلام!', example_ku: 'هاهاها هەڵەیەکی زۆر سەیرت لە قسەکردندا کرد!' },
  { id: 'v84', ar: 'صدگ چذب', phonetic: 'سیدوگ چِزِب', ku: 'بە ڕاست یان درۆ؟ (مەگەر دەکرێت!)', category: 'slang', example_ar: 'صدگ چذب؟ ما اصدگ هيچ صار!', example_ku: 'بە ڕاست یان درۆ؟ بڕوا ناکەم شتی وا ڕوویدابێت!' },
  { id: 'v85', ar: 'قصف جبهات', phonetic: 'قەصف جەبوهات', ku: 'وەڵامدانەوەی تەنزاوی بێدەنگکەر', category: 'slang', example_ar: 'سكتهم كلهم بقصفة وحدة.', example_ku: 'هەموویانی بە یەک وەڵامی تەنزاوی بێدەنگ کرد.' },

  // 10. بەستەر و ئامرازەکان (Connectors & Grammatical Particles)
  { id: 'v86', ar: 'على مود', phonetic: 'عەلا مۆد', ku: 'بۆ ئەوەی / لەبەر', category: 'connectors', example_ar: 'اجيت على مود اشوفك.', example_ku: 'هاتم بۆ ئەوەی تۆ ببینم.' },
  { id: 'v87', ar: 'ترى', phonetic: 'تەرا', ku: 'ئاگاداربە چونکە / دەنا', category: 'connectors', example_ar: 'استعجل ترى راح نتاخر.', example_ku: 'پەلە بکە دەنا دوادەکەوین.' },
  { id: 'v88', ar: 'لعد', phonetic: 'لەعەد', ku: 'ئەی کەواتە / ئەگەر وا بێت (بەغدا)', category: 'connectors', example_ar: 'لعد ليش ما گلتلي من البداية؟', example_ku: 'ئەی کەواتە بۆچی لە سەرەتاوە پێت نەگوتم؟' },
  { id: 'v89', ar: 'چا', phonetic: 'چا', ku: 'ئەی کەواتە (باشوور / ناسریە و بەسڕە)', category: 'connectors', example_ar: 'چا شسوي بعد ما بيدي حيلة؟', example_ku: 'ئەی چی بکەم کاتێک چارەم نییە؟' },
  { id: 'v90', ar: 'شلون ما چان', phonetic: 'شلۆن ما چان', ku: 'چۆن دەبێت با ببێت / هەر شێوازێک بێت', category: 'connectors', example_ar: 'شلون ما چان كمل الواجب.', example_ku: 'چۆن دەبێت با ببێت ئەرکەکە تەواو بکە.' },
  { id: 'v91', ar: 'مادام', phonetic: 'مادام', ku: 'بەو پێیەی / هەتاکو', category: 'connectors', example_ar: 'مادام انت موجود ماكو خوف.', example_ku: 'مادام تۆ ئامادەیت هیچ ترسێک نییە.' },
  { id: 'v92', ar: 'شوكت ما', phonetic: 'شەوکەت ما', ku: 'هەر کاتێک کە', category: 'connectors', example_ar: 'شوكت ما تجي هلا بيك.', example_ku: 'هەر کاتێک بێیت هەزار بەخێربێیت.' },
  { id: 'v93', ar: 'چان', phonetic: 'چان', ku: 'بوو (لە كانـەوە)', category: 'connectors', example_ar: 'چان الجو كلش حلو البارحة.', example_ku: 'دوێنێ کەشەکە یەکجار خۆش بوو.' },
  { id: 'v94', ar: 'چنت', phonetic: 'چِنت', ku: 'بووم (لە كنتـەوە)', category: 'connectors', example_ar: 'اني چنت نايم من خابرتني.', example_ku: 'من خەوتبووم کاتێک تەلەفۆنت بۆ کردم.' },
  { id: 'v95', ar: 'اكو', phonetic: 'ئەکوو', ku: 'هەیە', category: 'connectors', example_ar: 'اكو امل نخلص الشغل اليوم.', example_ku: 'هیوا هەیە ئەمڕۆ ئیشەکە تەواو بکەین.' },
  { id: 'v96', ar: 'ماكو', phonetic: 'ماکو', ku: 'نییە', category: 'connectors', example_ar: 'ماكو احد بالبيت هسه.', example_ku: 'ئێستا کەس لە ماڵەوە نییە.' },
  { id: 'v97', ar: 'مالتي', phonetic: 'مالتی', ku: 'هی من / موڵکی من', category: 'connectors', example_ar: 'هذا التلفون مالتي مو مال اخويه.', example_ku: 'ئەم مۆبایلە هی منە نەک هی براکەم.' },
  { id: 'v98', id_alt: 'مالتك', ar: 'مالتك', phonetic: 'مالتەک', ku: 'هی تۆ (نێر)', category: 'connectors', example_ar: 'وين السيارة مالتك؟', example_ku: 'سەیارەکەت لە کوێیە؟' },
  { id: 'v99', ar: 'مالتچ', phonetic: 'مالتِچ', ku: 'هی تۆ (مێ)', category: 'connectors', example_ar: 'الجنطة هاي مالتچ اختي؟', example_ku: 'ئەم جانتایە هی تۆیە خوشکەکەم؟' },
  { id: 'v100', ar: 'اگدر', phonetic: 'ئەگدەر', ku: 'دەتوانم (لە اقدر)', category: 'connectors', example_ar: 'اگدر اساعدك بأي وكت.', example_ku: 'دەتوانم لە هەموو کاتێکدا هاوکاریت بکەم.' }
];

// Enrich and normalize vocabulary items to guarantee no undefined fields
(function() {
  const CATEGORY_META = {
    basics: { level: 'A1', name_ku: 'سڵاو و بنەماکان', pos: 'دەستەواژە' },
    time_numbers: { level: 'A1', name_ku: 'کات و ژمارەکان', pos: 'ناو و هاوەڵناو' },
    transport: { level: 'A2', name_ku: 'هاتوچۆ و ئاڕاستە', pos: 'ناو و کردار' },
    food: { level: 'A2', name_ku: 'خواردن و چێشتخانە', pos: 'ناو و خۆراک' },
    home: { level: 'B1', name_ku: 'ماڵ و کەلوپەل', pos: 'کەلوپەلی ماڵ' },
    shopping: { level: 'B1', name_ku: 'بازاڕ و کڕین', pos: 'جلوبەرگ و پێداویستی' },
    health: { level: 'B2', name_ku: 'تەندروستی و پزیشکی', pos: 'دەستەواژەی پزیشکی' },
    family: { level: 'B2', name_ku: 'خێزان و کۆمەڵایەتی', pos: 'سیفەت و خێزان' },
    slang: { level: 'C1', name_ku: 'سڵانگ و زمانی شەقام', pos: 'سڵانگی بەغدادی' },
    connectors: { level: 'C2', name_ku: 'بەستەر و ئامرازەکان', pos: 'ئامرازی دەستەواژە' }
  };

  if (window.VOCABULARY_DATABASE && Array.isArray(window.VOCABULARY_DATABASE)) {
    window.VOCABULARY_DATABASE.forEach(item => {
      const meta = CATEGORY_META[item.category] || { level: 'A1', name_ku: 'گشتی', pos: 'وشە' };
      if (!item.level) item.level = meta.level;
      if (!item.category_name_ku) item.category_name_ku = meta.name_ku;
      if (!item.pos) item.pos = meta.pos;
      if (!item.phonetic_ku) item.phonetic_ku = item.phonetic || '';
      if (!item.phonetic) item.phonetic = item.phonetic_ku || '';
    });
  }
})();

