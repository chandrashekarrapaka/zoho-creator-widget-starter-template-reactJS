import React, { useEffect, useState } from "react";

const PatternStorage = (props) => {
  const [pattern, setPattern] = useState([]);
  const curPlId = props.cp[0].plantid;

  useEffect(() => {
    const newPattern = [];
    props.plantsData.forEach((item) => {
      if (item !== undefined) {
        const newItems = item[0].plantid;
        newPattern.push(newItems);
      }
    });

    // Reorder the pattern if cp changes
    const currentIndex = newPattern.indexOf(props.cp[0].plantid);
    if (currentIndex !== -1) {
      newPattern.splice(currentIndex, 1);
      newPattern.unshift(props.cp[0].plantid);
    }

    setPattern(newPattern);
    // Store the pattern in sessionStorage
    sessionStorage.setItem('plantPattern', JSON.stringify(newPattern));
    const loginResponse = window.ZOHO.CREATOR.init().then(function (data) {
      let accessTokenz = "";
      let userid = window.ZOHO.CREATOR.UTIL.getQueryParams().user;

      var config = {
        appName: "thk-control-room",
        reportName: "My_Profile_Data",
        criteria: "Username == \"" + userid + "\"",
        page: "1",
        pageSize: "100"
      };

      const access = window.ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
        const idx = response.data[0].ID;
        const formData = {
          "data": {
            "PlantPattern": JSON.stringify(newPattern)
          }
        }
        const config = {
          appName: "thk-control-room",
          reportName: "My_Profile_Data",
          id: idx,
          data: formData
        };

        const acce = window.ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
          if (response.code == 3000 && response.message == "Data Updated Successfully") {
          }
        });
      });

    });
  }, [props.plantsData, curPlId]);

  // Render your component
  return <></>;
};

export default PatternStorage;
