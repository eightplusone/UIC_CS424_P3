Each data entry in the annotation file is tab-separated. Each line contains:
  - id: each annotation has its own unique value.
  - anno_type: this value can be "n2n" (node-to-node), "n2e" (node-to-edge), "e2n" (edge-to-node), or "e2e" (edge-to-edge).
  - cat: category of the annotation.
  - start: if the annotation starts at a node, this value is the offset of the node in the given document. If the annotation starts at an edge, this value is the id of the edge.
  - end: if the target is a node, this value is the offset of the target in the given document. If the target is an edge, this value is the id of the edge.

Reference: BioCreative IV CHEMDNER corpus (Version 1.0 30-09-2014)
