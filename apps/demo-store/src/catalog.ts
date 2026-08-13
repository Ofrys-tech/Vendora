import { money, type Category, type Product } from '@vendora/core';

export const demoCategories: Category[] = [
  { id: 'resources', name: 'Resources', parentId: null, slug: 'resources' },
  { id: 'templates', name: 'Templates', parentId: 'resources', slug: 'templates' },
  { id: 'licenses', name: 'Test licenses', parentId: null, slug: 'licenses' },
];

export const demoProducts: Product[] = [
  {
    categoryId: 'resources',
    description: 'A concise PDF field guide for planning a focused digital project.',
    id: 'field-guide',
    name: 'Project Field Guide PDF',
    price: money(1200, 'USD'),
    slug: 'project-field-guide',
    tags: ['pdf', 'guide'],
  },
  {
    categoryId: 'templates',
    description: 'A reusable planning template delivered as a compact archive.',
    id: 'planning-kit',
    maxQuantity: 5,
    name: 'Planning Kit Archive',
    price: money(1800, 'USD'),
    slug: 'planning-kit',
    tags: ['archive', 'template'],
  },
  {
    categoryId: 'licenses',
    description: 'A non-functional license string for testing automated delivery.',
    id: 'test-license',
    name: 'Test License',
    price: money(500, 'USD'),
    slug: 'test-license',
    tags: ['license', 'test'],
  },
];
