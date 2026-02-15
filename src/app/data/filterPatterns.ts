export const FRAMEWORK_KEYWORDS: Record<string, string[]> = {
  'React': ['react', 'reactjs', 'react.js'],
  'Next.js': ['nextjs', 'next.js', 'next'],
  'React Native': ['react native', 'react-native', 'rn'],
  'Vue': ['vue', 'vuejs', 'vue.js'],
  'Angular': ['angular', 'angularjs'],
  'Three.js': ['threejs', 'three.js', 'three', 'webgl'],
  'Swift': ['swift', 'swiftui'],
  'SwiftUI': ['swiftui', 'swift ui'],
  'Kotlin': ['kotlin'],
  'TypeScript': ['typescript', 'ts'],
  'Node.js': ['nodejs', 'node.js', 'node'],
  'Jetpack Compose': ['jetpack compose', 'jetpack', 'compose'],
};

export const PLATFORM_KEYWORDS: Record<string, string[]> = {
  'Web': ['web', 'website', 'webapp', 'web app'],
  'iOS': ['ios', 'iphone', 'ipad', 'apple'],
  'Android': ['android'],
  'Mobile': ['mobile', 'app'],
  'Cloud': ['cloud', 'aws', 'infrastructure'],
};

export const SKILL_KEYWORDS: Record<string, string[]> = {
  'UI/UX': ['ui', 'ux', 'design', 'interface', 'user experience', 'user interface'],
  'Full-stack': ['fullstack', 'full-stack', 'full stack'],
  'Frontend': ['frontend', 'front-end', 'front end'],
  'Backend': ['backend', 'back-end', 'back end'],
  '3D': ['3d', 'three dimensional', 'webgl', '3d visualization'],
  'Data Visualization': ['data viz', 'dataviz', 'visualization', 'charts', 'analytics'],
  'Mobile Development': ['mobile dev', 'mobile development', 'app development'],
  'DevOps': ['devops', 'dev ops', 'deployment', 'ci/cd'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
  'Design Systems': ['design system', 'design systems', 'component library'],
};

export const TOOL_KEYWORDS: Record<string, string[]> = {
  'Figma': ['figma'],
  'Storybook': ['storybook'],
  'Docker': ['docker'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services'],
  'Xcode': ['xcode'],
  'Android Studio': ['android studio'],
  'Expo': ['expo'],
  'D3.js': ['d3', 'd3.js'],
  'Chart.js': ['chartjs', 'chart.js'],
  'Blender': ['blender'],
};

export const YEAR_PATTERN = /\b(20\d{2})\b/g;
