 export  function PersonsData(pages:any[]){
  
 const allUsers = pages
  .flatMap(page => 
      page.map((user:any) => user)
  );
  return allUsers;
 }

