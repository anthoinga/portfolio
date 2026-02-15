import type { Project } from '@/app/types';

export const column1Projects: Project[] = [
  {
    id: 'designing-scale',
    size: 'large',
    imageUrl: '/images/designing-scale.png',
    imageAlt: 'Designing for Scale',
    url: 'https://anthonyi.notion.site/Designing-for-Scale-259037de3129805b9822d688be9175ea?source=copy_link',
  },
  {
    id: 'ny-phil',
    size: 'small',
    imageUrl: '/images/ny-phil.png',
    imageAlt: 'NY Philharmonic',
    url: 'https://www.nyphil.org/',
  },
  {
    id: 'robert-half-ios',
    size: 'large',
    imageUrl: '/images/robert-half-ios.png',
    imageAlt: 'Robert Half iOS App',
    url: 'https://apps.apple.com/us/app/robert-half-job-search-more/id1400914659',
  },
];

export const column2Projects: Project[] = [
  {
    id: '7eleven',
    size: 'small',
    imageUrl: '/images/7eleven.png',
    imageAlt: '7-Eleven AI Experiences',
    url: 'https://www.7-eleven.com/',
    header: 'Crafting AI Experiences at 7-Eleven',
  },
  {
    id: 'infrastructure',
    size: 'large',
    imageUrl: '/images/infrastructure.png',
    imageAlt: 'Building New Infrastructure',
    url: 'https://anthonyi.notion.site/Building-New-Infrastructure-257037de31298000bd68fa954cb48ec1?source=copy_link',
  },
  {
    id: 'pulsar',
    size: 'small',
    imageUrl: '/images/pulsar.png',
    imageAlt: 'Bajaj Pulsar N160',
    url: 'https://www.bajajauto.com/bikes/pulsar/pulsar-n160',
  },
  {
    id: 'robert-half-android',
    size: 'large',
    imageUrl: '/images/robert-half-android.png',
    imageAlt: 'Robert Half Android App',
    url: 'https://play.google.com/store/apps/details?id=com.roberthalf.roberthalfdirect&pli=1',
  },
];

export const column3Projects: Project[] = [
  {
    id: 'mobile-app-1',
    size: 'large',
    imageUrl: '/images/mobile-app.png',
    imageAlt: 'Mobile Application',
    url: '#',
  },
  {
    id: 'dashboard',
    size: 'small',
    imageUrl: '/images/dashboard.png',
    imageAlt: 'Dashboard View',
    url: 'https://anthonyi.notion.site/Building-New-Infrastructure-257037de31298000bd68fa954cb48ec1?source=copy_link',
  },
];

export const allProjects: Project[] = [
  ...column1Projects,
  ...column2Projects,
  ...column3Projects,
];
