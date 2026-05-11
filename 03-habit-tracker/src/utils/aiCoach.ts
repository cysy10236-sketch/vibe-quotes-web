import type { CoachAdvice } from '../types';

const habitCategories: Record<string, { name: string; keywords: string[] }> = {
  fitness: { name: '健身运动', keywords: ['运动', '健身', '跑步', '游泳', '瑜伽', 'gym', '锻炼', '跳绳', '骑行', '走路', '散步', '训练'] },
  reading: { name: '阅读学习', keywords: ['阅读', '读书', '看书', '学习', 'study', 'read', '写作', '写日记', '日记'] },
  meditation: { name: '冥想正念', keywords: ['冥想', 'meditation', '正念', '呼吸', '静坐', '打坐'] },
  diet: { name: '饮食健康', keywords: ['饮食', '喝水', 'diet', 'water', '素食', '戒糖', '早餐', '健康饮食', '节食'] },
  sleep: { name: '睡眠作息', keywords: ['睡眠', 'sleep', '早起', '早睡', '作息', '起床', '睡觉'] },
  productivity: { name: '效率习惯', keywords: ['规划', '计划', '番茄', '专注', '效率', '时间管理', 'todo', '工作', '整理'] },
};

function categorizeHabit(habitName: string): string {
  for (const [key, category] of Object.entries(habitCategories)) {
    if (category.keywords.some(kw => habitName.includes(kw))) {
      return key;
    }
  }
  return 'general';
}

const adviceTemplates: Record<string, Omit<CoachAdvice, 'habitName'>> = {
  fitness: {
    suggestions: [
      '从低强度开始：每天只需5-10分钟，让身体逐步适应，避免一开始就过度运动导致放弃。',
      '固定时间触发：将运动安排在每天的同一时间（如早起后或下班后），利用环境触发建立条件反射。',
      '准备运动装备：前一天晚上把运动服、跑鞋放在显眼位置，减少行动阻力。',
      '记录运动数据：追踪运动时长、强度等数据，看到进步会带来持续动力。',
    ],
    actionPlan: [
      { step: 1, description: '第一周：每天运动5-10分钟，重在建立时间习惯而非强度' },
      { step: 2, description: '第二周：逐步增加到15-20分钟，加入简单的力量或柔韧性训练' },
      { step: 3, description: '第三周：尝试不同类型的运动，找到你真正喜欢的运动方式' },
      { step: 4, description: '第四周：制定周运动计划，每次30分钟，形成稳定的运动节奏' },
    ],
    tip: '研究表明，坚持运动21天后，多巴胺的分泌模式会发生变化——你会开始期待运动而非抵触它。',
  },
  reading: {
    suggestions: [
      '设定最小目标：每天只读5页，即使再忙也能完成，关键在于不间断。',
      '创造阅读环境：在家里布置一个舒适的阅读角落，减少手机等干扰源。',
      '利用碎片时间：通勤、排队、睡前等时间积少成多，准备一本随时可读的书。',
      '输出倒逼输入：读完一章后写三句话总结，加深理解和记忆。',
    ],
    actionPlan: [
      { step: 1, description: '第一周：每天阅读5页，选择一本感兴趣且易读的书开始' },
      { step: 2, description: '第二周：增加到每天10页，开始在读后写一句话笔记' },
      { step: 3, description: '第三周：尝试不同题材（小说、非虚构、专业书各一本并读）' },
      { step: 4, description: '第四周：建立阅读笔记系统，每月计划读完1-2本书' },
    ],
    tip: '查理·芒格说："我见过的聪明人没有一个不每天阅读的——一个都没有。"阅读是复利效应最显著的投资。',
  },
  meditation: {
    suggestions: [
      '从2分钟开始：不需要一次冥想30分钟，2分钟的专注呼吸就是一个很好的开始。',
      '使用引导音频：初期使用冥想App的引导音频，跟随指引比自己静坐更容易坚持。',
      '不追求"清空"：冥想不是要完全不想事情，而是觉察到走神后温柔地拉回来。',
      '固定锚点：将冥想链接到某个已有习惯上（如刷牙后、喝咖啡前），利用习惯堆叠。',
    ],
    actionPlan: [
      { step: 1, description: '第一周：每天2分钟呼吸练习，使用计时器而非强迫自己静坐更久' },
      { step: 2, description: '第二周：尝试5分钟身体扫描冥想，觉察身体各部位的感受' },
      { step: 3, description: '第三周：尝试在不同场景练习（坐姿、行走、吃饭时各一次）' },
      { step: 4, description: '第四周：建立每日10分钟的冥想习惯，可以拆分为早晚各5分钟' },
    ],
    tip: '哈佛研究显示，8周的每日冥想练习就能显著增加大脑灰质密度，提升专注力和情绪调节能力。',
  },
  sleep: {
    suggestions: [
      '固定入睡和起床时间：即使是周末也保持一致，这是改善睡眠质量最有效的方法。',
      '睡前1小时远离屏幕：蓝光抑制褪黑素分泌，睡前阅读纸质书或听播客更好。',
      '优化睡眠环境：保持卧室凉爽（18-22°C）、黑暗、安静，投资好的枕头和床垫。',
      '建立睡前仪式：如泡脚、轻音乐、拉伸放松，给大脑"即将入睡"的信号。',
    ],
    actionPlan: [
      { step: 1, description: '第一周：固定起床时间，无论几点睡都在同一时间起床' },
      { step: 2, description: '第二周：设定睡前闹钟，提醒自己30分钟后放下手机准备入睡' },
      { step: 3, description: '第三周：创建20分钟的睡前仪式（如阅读+轻音乐+深呼吸）' },
      { step: 4, description: '第四周：调整到每晚7-8小时睡眠，记录睡眠质量并持续优化' },
    ],
    tip: '睡眠科学家Matthew Walker指出："睡眠是你所能做的对健康最有效的一件事。"睡眠不足与几乎所有慢性疾病相关。',
  },
  diet: {
    suggestions: [
      '一次只改变一个饮食习惯：不要同时戒糖、少吃碳水、多喝水——选择一项坚持两周再做下一项。',
      '用替代而非禁止：想喝汽水时喝气泡水+柠檬，想吃零食时吃一小把坚果。',
      '记录饮食日志：写下吃下的每一口食物能显著提升对饮食的觉察力。',
      '水分先行：每天起床后立即喝一杯水，每餐前半小时喝一杯水，保持水分充足。',
    ],
    actionPlan: [
      { step: 1, description: '第一周：每天记录食物日志（不改变饮食，只记录）' },
      { step: 2, description: '第二周：基于日志选择一个最容易改变的点（如多喝水或少吃糖）' },
      { step: 3, description: '第三周：准备健康的零食替代品，在饥饿时有plan B' },
      { step: 4, description: '第四周：逐步优化三餐结构，确保每餐有蛋白质+蔬菜+优质碳水' },
    ],
    tip: '不必追求完美——80/20法则：80%的时间健康饮食，20%的时间享受美食，更容易长期坚持。',
  },
  general: {
    suggestions: [
      '遵循2分钟法则：新习惯应在2分钟内完成。把"每天运动"简化为"穿上运动服"。',
      '习惯堆叠法(Habit Stacking)：在现有习惯之后插入新习惯，如"喝完早晨咖啡后冥想2分钟"。',
      '环境设计 > 意志力：减少坏习惯的提示（把手机放远），增加好习惯的提示（把书放枕边）。',
      '追踪进度但不迷信数字：打卡的目的是建立身份认同（"我是一个有纪律的人"），而非单纯刷数据。',
    ],
    actionPlan: [
      { step: 1, description: '明确习惯的具体执行意图：在[时间] 在[地点] 做[行为]' },
      { step: 2, description: '记录前3天的感受和障碍，了解什么在阻止你坚持' },
      { step: 3, description: '优化环境和触发条件，让好习惯更便捷、坏习惯更困难' },
      { step: 4, description: '建立复盘机制：每周检查进度，庆祝小胜利，调整策略' },
    ],
    tip: 'James Clear在《原子习惯》中说："你不会到达目标的高度——你会下降到你系统的水平。"专注于建立系统而非设定目标。',
  },
  productivity: {
    suggestions: [
      '每天只定3件最重要的事：完成比完美重要，先吃掉那只青蛙。',
      '番茄工作法：25分钟专注+5分钟休息，减少多任务切换的成本。',
      '晚上做第二天的计划：花5分钟列出明天的MIT，第二天一早就知道该做什么。',
      '周回顾：每周日花15分钟回顾本周完成情况，调整下周计划。',
    ],
    actionPlan: [
      { step: 1, description: '每天早上写下3件最重要的事，完成后再做其他' },
      { step: 2, description: '尝试番茄工作法，一天至少完成4个番茄钟' },
      { step: 3, description: '晚上5分钟制定次日计划，减少决策疲劳' },
      { step: 4, description: '建立周回顾习惯：What went well? What to improve? Next week focus?' },
    ],
    tip: 'Ivy Lee方法：100多年前至今有效——每天结束前列出明天最重要的6件事，按优先级排序，第二天从第一件开始做。',
  },
};

export function generateCoachAdvice(habitName: string): CoachAdvice {
  const category = categorizeHabit(habitName);
  const template = adviceTemplates[category] ?? adviceTemplates.general;
  return { ...template, habitName };
}

export function getCategoryName(habitName: string): string {
  const category = categorizeHabit(habitName);
  return habitCategories[category]?.name ?? '一般习惯';
}
