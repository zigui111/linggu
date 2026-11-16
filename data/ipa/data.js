(function () {
  const labelMap = {
    前: "前",
    央: "央",
    後: "后",
    展唇: "展唇",
    圓唇: "圆唇",
    高: "高",
    半高: "半高",
    中: "中",
    半低: "半低",
    低: "低",
    雙唇: "双唇",
    唇齒: "唇齿",
    齒間: "齿间",
    舌尖前: "舌尖前",
    舌尖後: "舌尖后",
    "舌葉/舌尖面": "舌叶/舌尖面",
    舌面前: "舌面前",
    舌面中: "舌面中",
    "舌根/舌面後": "舌根/舌面后",
    小舌: "小舌",
    喉: "喉",
    塞不帶音不送氣: "塞不带音不送气",
    塞不帶音送氣: "塞不带音送气",
    塞帶音不送氣: "塞带音不送气",
    塞帶音送氣: "塞带音送气",
    塞擦不帶音不送氣: "塞擦不带音不送气",
    塞擦不帶音送氣: "塞擦不带音送气",
    塞擦帶音不送氣: "塞擦带音不送气",
    塞擦帶音送氣: "塞擦带音送气",
    鼻音: "鼻音",
    閃音: "闪音",
    邊音: "边音",
    擦音不帶音: "擦音不带音",
    擦音帶音: "擦音带音",
    半元音: "半元音"
  };

  const toSimplified = (value) => {
    if (value === null || value === undefined) return null;
    return labelMap[value] || value;
  };

  const reverseLabelMap = Object.fromEntries(
    Object.entries(labelMap).map(([traditional, simplified]) => [simplified, traditional])
  );

  const toTraditional = (value) => {
    if (value === null || value === undefined) return null;
    return reverseLabelMap[value] || value;
  };

  const vowelSource = {
    sheetName: "常用之國際音標IPA列表【元音】",
    positions: ["前", "央", "後"],
    lipShapes: ["展唇", "圓唇"],
    heights: ["高", "半高", "中", "半低", "低"],
    body: [
      ["高", "i", "y", "ɨ", "ɯ", "u"],
      ["半高", "e", "ø ", "ə", "ɤ", "o"],
      ["中", "ɛ", "œ", null, "ʌ", "ɔ"],
      ["半低", "æ ", null, "ɐ", null, null],
      ["低", "a", null, null, "ɑ", "ɒ"]
    ]
  };

  const consonantSource = {
    sheetName: "常用之國際音標IPA列表【輔音】",
    cornerLabel: "發音方法 \\ 發音部位",
    places: [
      "雙唇",
      "唇齒",
      "齒間",
      "舌尖前",
      "舌尖後",
      "舌葉/舌尖面",
      "舌面前",
      "舌面中",
      "舌根/舌面後",
      "小舌",
      "喉"
    ],
    body: [
      ["塞不帶音不送氣", "p", null, null, "t", "ʈ", null, "ȶ", "c", "k", "q", "ʔ"],
      ["塞不帶音送氣", "ph", null, null, "th", "ʈh", null, "ȶh", "ch", "kh", "qh", null],
      ["塞帶音不送氣", "b", null, null, "d", "ɖ", null, "ȡ", "ɟ", "g/g", "ɢ", null],
      ["塞帶音送氣", "bh", null, null, "dh", "ɖh", null, "ȡh", "ɟh", "gh/gh", "ɢh", null],
      ["塞擦不帶音不送氣", null, "pf", null, "ts", "tʂ", "tʃ", "tɕ", null, null, null, null],
      ["塞擦不帶音送氣", null, "pfh", null, "tsh", "tʂh", "tʃh", "tɕh", null, null, null, null],
      ["塞擦帶音不送氣", null, "bv", null, "dz", "dʐ", "dʒ", "dʑ", null, null, null, null],
      ["塞擦帶音送氣", null, "bvh", null, "dzh", "dʐh", "dʒh", "dʑh", null, null, null, null],
      ["鼻音", "m", "ɱ", null, "n", "ɳ", null, "ȵ", "ɲ", "ŋ", "ɴ", null],
      ["閃音", null, null, null, "r", null, null, null, null, null, null, null],
      ["邊音", null, null, null, "l", null, null, null, null, null, null, null],
      ["擦音不帶音", "ɸ", "f", "θ", "s", "ʂ", "ʃ", "ɕ", null, "x", "χ", "h"],
      ["擦音帶音", "β", "v", "ð", "z", "ʐ", "ʒ", "ʑ", null, "ɣ", "ʁ", "ɦ"],
      ["半元音", "w", null, null, null, null, null, null, "j", null, null, null]
    ]
  };

  const vowelEntries = [];
  vowelSource.body.forEach((row, rowIndex) => {
    const height = row[0];
    const slots = [
      { column: 1, position: "前", lipShape: "展唇" },
      { column: 2, position: "前", lipShape: "圓唇" },
      { column: 3, position: "央", lipShape: null },
      { column: 4, position: "後", lipShape: "展唇" },
      { column: 5, position: "後", lipShape: "圓唇" }
    ];

    slots.forEach((slot) => {
      const ipa = row[slot.column];
      if (!ipa) return;
      vowelEntries.push({
        ipa: ipa.trim(),
        position: toSimplified(slot.position),
        lipShape: toSimplified(slot.lipShape),
        height: toSimplified(height),
        sourceCell: `${String.fromCharCode(65 + slot.column)}${rowIndex + 3}`
      });
    });
  });

  const consonantEntries = [];
  consonantSource.body.forEach((row, rowIndex) => {
    const manner = row[0];
    consonantSource.places.forEach((place, placeIndex) => {
      const ipa = row[placeIndex + 1];
      if (!ipa) return;
      consonantEntries.push({
        ipa: ipa.trim(),
        place: toSimplified(place),
        manner: toSimplified(manner),
        sourceCell: `${String.fromCharCode(66 + placeIndex)}${rowIndex + 2}`
      });
    });
  });

  window.IPA_DATA = {
    sourceFile: "IPA列表【元音+辅音】.xlsx",
    toSimplified,
    toTraditional,
    vowels: {
      ...vowelSource,
      positions: vowelSource.positions.map(toSimplified),
      lipShapes: vowelSource.lipShapes.map(toSimplified),
      heights: vowelSource.heights.map(toSimplified),
      entries: vowelEntries
    },
    consonants: {
      ...consonantSource,
      cornerLabel: toSimplified(consonantSource.cornerLabel),
      places: consonantSource.places.map(toSimplified),
      entries: consonantEntries,
      manners: consonantSource.body.map((row) => toSimplified(row[0]))
    }
  };
})();
