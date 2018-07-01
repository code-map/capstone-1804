
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

//returns All steps of Path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'S15sugxIGQ'})-[:STEPS*]->(s:Step)
RETURN p,s

//returns step 1 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[:STEPS*1]->(s:Step)
RETURN s

//returns step 2 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[:STEPS*2]->(s:Step)
RETURN s

//returns step 3 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[:STEPS*3]->(s:Step)
RETURN s

//returns steps 2 to 4 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[:STEPS*2..4]->(s:Step)
RETURN s

//x//returns steps 2 to 4 of id 'HycFUUFHf7'
MATCH (:Path {uid:'HycFUUFHf7'})-[:STEPS*2]->(s2:Step),
      (:Path {uid:'HycFUUFHf7'})-[:STEPS*3]->(s3:Step)
RETURN s2, s3

//returns step 2 of id 'HycFUUFHf7'
MATCH (:Path {uid:'HycFUUFHf7'})-[:STEPS*2]->(s2:Step)
RETURN s2

//x//returns steps 2 to 3 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(s2:Step),
                              (p)-[sE:STEPS*3]->(s3:Step)
RETURN s2, s3, p

//x//returns steps 2 to 3 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*4]->(s4:Step),
                              (p)-[sE:STEPS*2]->(s2:Step)
RETURN s4, s2, p


//returns steps 2 to 3 of id 'HycFUUFHf7'
MATCH (s2:Step)<-[sE:STEPS*2]-(p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*4]->(s4:Step)
RETURN s4, s2, p
//returns steps 4 of path of id 'HycFUUFHf7'


//x//returns steps 1 and 2 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(s2:Step),
                              (p)-[sE:STEPS*1]->(s1:Step)
RETURN s1, s2, p
//returns step 2 of path id 'HycFUUFHf7'

//x//returns steps 1 and 2 of id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(s2:Step)
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*1]->(s1:Step)
RETURN s1, s2, p
//x//returns step 2 of path id 'HycFUUFHf7'


//returns steps 1 and 2 and 3 of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sCurr:Step)
WITH sCurr
MATCH (sPrev:Step)-[:STEPS]->(sCurr)-[:STEPS]->(sNext:Step)
RETURN sPrev, sCurr, sNext

//returns steps 1 and 2 and 3 of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sFrom:Step)
WITH sFrom
MATCH (sFromPrev:Step)-[:STEPS]->(sFrom)-[:STEPS]->(sFromNext:Step)
RETURN sFrom, sFromPrev, sFromNext



//returns steps  Curr and Next of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sCurr:Step),
                             (sCurr)-[:STEPS]->(sNext:Step)
RETURN sCurr, sNext

//returns steps  Curr and Next of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sCurr:Step)
RETURN sCurr

//returns steps  Curr and Next of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sCurr:Step),
                             (sCurr)<-[:STEPS]-(sPrev:Step)
RETURN sCurr, sPrev

//returns steps From and FromPrev and FromNext of path with id 'HycFUUFHf7'
//And returns steps To and ToPrev and ToNext of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sFrom:Step)
WITH sFrom
MATCH (sFromPrev:Step)-[:STEPS]->(sFrom)-[:STEPS]->(sFromNext:Step)
WITH sFrom, sFromPrev, sFromNext
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*5]->(sTo:Step)
WITH sTo, sFrom, sFromPrev, sFromNext
MATCH (sToPrev:Step)-[:STEPS]->(sTo)-[:STEPS]->(sToNext:Step)
RETURN sFrom, sFromPrev, sFromNext, sTo, sToPrev, sToNext

//returns steps From and FromPrev and FromNext of path with id 'HycFUUFHf7'
//And returns steps To and ToPrev and ToNext of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sFrom:Step),
      (sFromPrev:Step)-[:STEPS]->(sFrom)-[:STEPS]->(sFromNext:Step)
WITH sFrom, sFromPrev, sFromNext
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*5]->(sTo:Step),
      (sToPrev:Step)-[:STEPS]->(sTo)-[:STEPS]->(sToNext:Step)
RETURN sFrom, sFromPrev, sFromNext, sTo, sToPrev, sToNext
//returns no Changes no Records

//x//returns steps  Curr and Prev of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sCurr:Step),
                              (sCurr)<-[:STEPS]-(sPrev:Step)
RETURN sCurr, sPrev
//returns no Records



//x//returns steps, Curr and Prev, and Next of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[sE:STEPS*2]->(sPrev:Step),
      (sPrev)-[:STEPS]->(sCurr)-[:STEPS]->(sNext)
RETURN sCurr, sPrev, sNext, p
//returns no Records



//returns steps From and FromPrev and FromNext of path with id 'HycFUUFHf7'
//And returns steps To and ToPrev and ToNext of path with id 'HycFUUFHf7'
MATCH (p:Path {uid:'HycFUUFHf7'})-[:STEPS*1]->(sFrom:Step)
WITH sFrom, p
MATCH (sFromPrev)-[:STEPS]->(sFrom)-[:STEPS]->(sFromNext)
WITH sFrom, sFromPrev, sFromNext, p
MATCH (p)-[:STEPS*5]->(sTo:Step)
WITH sTo, sFrom, sFromPrev, sFromNext
MATCH (sToPrev)-[:STEPS]->(sTo)-[:STEPS]->(sToNext)
RETURN sFrom, sFromPrev, sFromNext, sTo, sToPrev, sToNext

//returns steps From and FromPrev and FromNext of path with id 'HycFUUFHf7'
//And returns steps To and ToPrev and ToNext of path with id 'HycFUUFHf7'
//And pulls the node from the From position and splices it to the To position
MATCH (p:Path {uid:'S15sugxIGQ'})-[:STEPS*4]->(fromC:Step)
WITH fromC, p
MATCH (fromP)-[fromPE:STEPS]->(fromC)-[fromNE:STEPS]->(fromN)
WITH fromC, fromP, fromN, p, fromPE, fromNE
MATCH (p)-[:STEPS*6]->(toC:Step)
WITH toC, fromC, fromP, fromN, fromPE, fromNE, p
MATCH (toP)-[toPE:STEPS]->(toC)-[toNE:STEPS]->(toN)
DELETE fromPE, fromNE, toPE
CREATE (fromP)-[:STEPS]->(fromN), (toP)-[:STEPS]->(fromC), (fromC)-[:STEPS]->(toC)


MATCH (p:Path {uid:'S15sugxIGQ'})-[:STEPS*]->(s:Step)
RETURN p,s

