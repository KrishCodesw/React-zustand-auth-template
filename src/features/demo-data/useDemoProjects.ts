import { useQuery } from '@tanstack/react-query'

import { fetchDemoProjects } from './demoData.api'

export function useDemoProjects() {
  return useQuery({
    queryKey: ['demo-projects'],
    queryFn: fetchDemoProjects,
  })
}

