export type Language = 'zh' | 'en';

export interface Translation {
  nav: {
    about: string;
    experiments: string;
    learn: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    exploreBtn: string;
    docsBtn: string;
    features: {
      aesthetic: { title: string; desc: string };
      tools: { title: string; desc: string };
      content: { title: string; desc: string };
    };
  };
  experiments: {
    title: string;
    subtitle: string;
    tryNow: string;
    backToList: string;
    imageGen: {
      title: string;
      desc: string;
      promptPlaceholder: string;
      generate: string;
      generating: string;
      selectModel: string;
      resultPlaceholder: string;
    };
  };
  learn: {
    title: string;
    backToList: string;
    coreChapters: string;
    startLearning: string;
    defaultDesc: string;
    chapters: string[];
    modules: {
      pytorch: string;
      vllm: string;
      openclaw: string;
    };
  };
}

export const translations: Record<Language, Translation> = {
  zh: {
    nav: {
      about: "关于",
      experiments: "实验室",
      learn: "学习",
    },
    about: {
      title: "llmcore.cn",
      subtitle: "汇聚 AI 开发者工具与前沿 AI 内容",
      description: "我们致力于为极客和开发者提供最前沿的 AI 实验工具与深度学习资源。在这里，探索 AI 的无限可能。",
      exploreBtn: "探索实验室",
      docsBtn: "查看文档",
      features: {
        aesthetic: { title: "极客美学", desc: "复刻 Google Labs 设计语言，极致简约与高效。" },
        tools: { title: "前沿工具", desc: "集成最新大模型能力，提供开箱即用的实验环境。" },
        content: { title: "深度内容", desc: "从理论到实践，汇聚 AI 领域的硬核学习资源。" },
      },
    },
    experiments: {
      title: "实验室",
      subtitle: "探索由最新 AI 模型驱动的实验性工具。",
      tryNow: "立即体验",
      backToList: "返回列表",
      imageGen: {
        title: "图像生成",
        desc: "使用 Gemini 模型将文字转化为精美的图像。",
        promptPlaceholder: "输入你的创意描述...",
        generate: "生成图像",
        generating: "正在创作中...",
        selectModel: "选择模型",
        resultPlaceholder: "生成的结果将在这里显示",
      },
    },
    learn: {
      title: "学习中心",
      backToList: "返回列表",
      coreChapters: "核心章节",
      startLearning: "开始学习",
      defaultDesc: "深度学习与工程实践指南，涵盖核心概念与高级技巧。",
      chapters: ['基础概念', '环境搭建', '实战演练', '进阶优化'],
      modules: {
        pytorch: "PyTorch 深度实践",
        vllm: "vLLM 推理优化",
        openclaw: "OpenClaw 开发者指南",
      },
    },
  },
  en: {
    nav: {
      about: "About",
      experiments: "Experiments",
      learn: "Learn",
    },
    about: {
      title: "llmcore.cn",
      subtitle: "Hub for AI Developer Tools & Content",
      description: "Dedicated to providing geeks and developers with cutting-edge AI experimental tools and deep learning resources. Explore the infinite possibilities of AI here.",
      exploreBtn: "Explore Labs",
      docsBtn: "View Docs",
      features: {
        aesthetic: { title: "Geek Aesthetic", desc: "Replicating Google Labs design language, extreme simplicity and efficiency." },
        tools: { title: "Cutting-edge Tools", desc: "Integrated with the latest LLM capabilities, providing out-of-the-box experimental environments." },
        content: { title: "Deep Content", desc: "From theory to practice, gathering core learning resources in the AI field." },
      },
    },
    experiments: {
      title: "Experiments",
      subtitle: "Explore experimental tools powered by the latest AI models.",
      tryNow: "Try it now",
      backToList: "Back to list",
      imageGen: {
        title: "Image Generation",
        desc: "Transform text into beautiful images using Gemini models.",
        promptPlaceholder: "Enter your creative prompt...",
        generate: "Generate Image",
        generating: "Creating...",
        selectModel: "Select Model",
        resultPlaceholder: "Generated results will appear here",
      },
    },
    learn: {
      title: "Learning Center",
      backToList: "Back to list",
      coreChapters: "Core Chapters",
      startLearning: "Start Learning",
      defaultDesc: "Deep learning and engineering practice guides, covering core concepts and advanced techniques.",
      chapters: ['Basic Concepts', 'Environment Setup', 'Hands-on Practice', 'Advanced Optimization'],
      modules: {
        pytorch: "PyTorch Deep Practice",
        vllm: "vLLM Inference Optimization",
        openclaw: "OpenClaw Developer Guide",
      },
    },
  },
};
