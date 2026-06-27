export const technologies = [
  {
    id: "genesys-cloud-cx",
    name: "Genesys Cloud CX",
    enabled: true,
    knowledgeBaseUrl: "/knowledge/genesys-cloud-cx-knowledge-base.txt",
    placeholder: "Ask anything about Genesys Cloud CX...",
  },
  { id: "genesys-engage", name: "Genesys Engage", enabled: false },
  { id: "cisco-ucce", name: "Cisco UCCE", enabled: false },
  { id: "nice-cxone", name: "NICE CXone", enabled: false },
  { id: "amazon-connect", name: "Amazon Connect", enabled: false },
  { id: "five9", name: "Five9", enabled: false },
  { id: "talkdesk", name: "Talkdesk", enabled: false },
  { id: "avaya", name: "Avaya", enabled: false },
  { id: "verint", name: "Verint", enabled: false },
  { id: "alvaria", name: "Alvaria", enabled: false },
];

export function getTechnologyById(id) {
  return technologies.find((technology) => technology.id === id);
}
