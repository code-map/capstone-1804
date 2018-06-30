
    MATCH (p:Path) WHERE p.uid = 'B1HWaF1XMX'
    OPTIONAL MATCH (p)-[:STEPS*]->(s:Step)-[:RESOURCE]->(r:Resource)
    RETURN { details: p, steps: collect( { step: s, resource: r } ) }



//gets all the Steps and Resource of Path Resource Id

  MATCH (p:Path)-[:STEPS*]->(s:Step)-[:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'
  RETURN s as Step, res as Resource

//Gets the step and Resource of Step 1

  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 1'
  RETURN s as Step, res as Resource

//Gets the step and Resource of Step 1, and Step 4

  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND (s.name = 'Step 1' OR s.name ='Step 4')
  RETURN s as Step, res as Resource

/////////////////////////////////////////////

  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'

//if you 
  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 1'
  RETURN s as StepA, res as ResourceA
  UNION ALL
  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 2'
  RETURN s as StepB, res as ResourceB

///

  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 1'
  WITH s as StepA, res as ResourceA
  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 2'
  WITH s as StepB, res as ResourceB
  CREATE (StepB)-[:RESOURCE]->(ResourceA)



  MATCH (pA:Path)-[:STEPS*]->(sA:Step)-[resEdgeA:RESOURCE]->(resA:Resource)
  MATCH (pB:Path)-[:STEPS*]->(sB:Step)-[resEdgeB:RESOURCE]->(resB:Resource)
  WHERE pA.uid='B1HWaF1XMX'AND sA.name = 'Step 1', 
        pB.uid='B1HWaF1XMX'AND sB.name = 'Step 2'
  CREATE (sA)-[:RESOURCE]->(ResB)


  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 1'
  RETURN s as Step, res as Resource

/////////
  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(r:Resource) WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 1',
  MATCH (pB:Path)-[:STEPS*]->(sB:Step)-[resEdgeB:RESOURCE]->(rB:Resource) WHERE pB.uid='B1HWaF1XMX'AND sB.name = 'Step 2'
  CREATE (s)-[:RESOURCE]->(rB)



  MATCH (p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(res:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 2' 
  RETURN res.uid as ResourceID

  MATCH (res:Resource {uid:"SJRlWaFJQGX"}),(p:Path)-[:STEPS*]->(s:Step)-[resEdge:RESOURCE]->(resB:Resource)
  WHERE p.uid='B1HWaF1XMX'AND s.name = 'Step 3' 
  CREATE (s)-[:RESOURCE]->(res)
  RETURN s as Step, resB as Resource



//adds a connection between resource of ID and step X of Path
MATCH (res:Resource {uid:"SJRlWaFJQGX"}), (Path {uid:'B1HWaF1XMX'})-[:STEPS*]->(s:Step)
WHERE s.name = 'Step 3' 
CREATE (s)-[:RESOURCE]->(res)
RETURN s as Step, res as Resource

//deletes a resource edge from StepX of path to resource of ID
MATCH (p:Path {uid:'B1HWaF1XMX'})-[:STEPS*]->(s:Step)-[resEdge :RESOURCE]->(res:Resource {uid:"SJRlWaFJQGX"})
WHERE s.name = 'Step 3' 
DELETE resEdge
RETURN s as Step, res as Resource


//plan of action
1 - The api query for a step should include the uid of a resource
1 - either the database query should make a call to the 
2 - a call to the api should reorder the steps using the resource-id's of the steps



