// Frontend-only demo "API" functions to showcase TanStack Query usage.
// Replace these with real HTTP calls when you add a backend.

export type DemoProject = {
  id: string
  name: string
  status: 'active' | 'archived'
}

const demoProjects: DemoProject[] = [
  { id: 'p1', name: 'First template project', status: 'active' },
  { id: 'p2', name: 'Second template project', status: 'active' },
]

export async function fetchDemoProjects(): Promise<DemoProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return demoProjects
}

