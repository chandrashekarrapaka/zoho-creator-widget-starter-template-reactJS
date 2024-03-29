let intervalId;

export async function Plants() {
  let accessToken = "";
  const arrayOfPlants = [];
  const arrayOfMachines = [];
  let apicallstatus = true;

  try {
    const loginResponse = await window.ZOHO.CREATOR.init().then(function (data) {
      let accessTokenz = "";
      let userid = window.ZOHO.CREATOR.UTIL.getQueryParams().user;

      var config = {
        appName: "infinite-control-room",
        reportName: "My_Profile_Data",
        criteria: "Username == \"" + userid + "\"",
        page: "1",
        pageSize: "100"
      };

      const access = window.ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
        let userData = response;
        accessTokenz = userData.data[0].Access_Token;
        return accessTokenz;
      });
      
      return access;
    });

    const queryParams = await window.ZOHO.CREATOR.init().then(function (data) {
      return window.ZOHO.CREATOR.UTIL.getQueryParams();
    });

    const loginData = await loginResponse;
    accessToken = loginData;

    let orgid = queryParams.PlantId.split(",")[1];
    const orgidAll = queryParams.PlantId.split(",");

    const fetchPlantsData = async () => {
      console.log("Fetching plants data at:", new Date());
      try {
        await Promise.all(orgidAll.map(async (orgid) => {
          const plantsResponse = await fetch(`https://api.infinite-uptime.com/api/3.0/idap-api/plants/${orgid}/machine-group-stats`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
            },
          });

          if (plantsResponse.status === 401) {
            apicallstatus = false;
            // Stop further API calls
           // clearInterval(intervalId);
            //console.log("apicallstatus: " + apicallstatus);
            return [[]],apicallstatus;
          }
          
          const plantsData = await plantsResponse.json();
          const plantsArray = [];
         // console.log(plantsData);
          
          plantsData.data.areas.forEach((area) => {
            area.machineGroups.forEach((mg) => {
              mg.machines.forEach((machine)=>{
              machine.mg = mg.name;
              machine.plantName = plantsData.data.name;
              machine.plantid = plantsData.data.id;
              plantsArray.push(machine);

              })
              
            });
          });

          arrayOfMachines.push(plantsArray);
          arrayOfPlants.push(plantsData.data);
        }));
      } catch (error) {
        throw error;
      }
    };

    await fetchPlantsData();

    
    intervalId = setInterval(fetchPlantsData, 30000);
   
    return [arrayOfMachines, apicallstatus];

  } catch (error) {
    //console.error(error);
    throw error;
  }
}


Plants()
  .then(([machines, status]) => {
    //console.log("Machines:", machines);
    //console.log("API Call Status:", status);
  })
  .catch((error) => {
    //console.log("Error:", error);
  });
