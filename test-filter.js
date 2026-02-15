// Quick test of filter functionality
const { executeFilter } = require('./src/app/utils/filterEngine.ts');
const { generateFilterResponse } = require('./src/app/utils/responseGenerator.ts');
const { allProjects } = require('./src/app/data/projects.ts');

console.log('Testing filter with "React projects"...');
try {
  const filterResult = executeFilter('React projects', allProjects);
  console.log('Filter result:', JSON.stringify(filterResult, null, 2));

  const response = generateFilterResponse(filterResult, allProjects);
  console.log('Generated response:', response.response);
} catch (error) {
  console.error('Error:', error);
}
