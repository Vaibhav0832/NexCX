export const technologies = [
  {
    id: "genesys-cloud-cx",
    name: "Genesys Cloud CX",
    enabled: true,
    knowledgeBaseUrl: "/knowledge/genesys-cloud-cx-knowledge-base.txt",
    placeholder: "Ask anything about Genesys Cloud CX...",
  },
  { id: "genesys-engage", name: "Genesys Engage", enabled: false },
];

export function getTechnologyById(id) {
  return technologies.find((technology) => technology.id === id);
}
