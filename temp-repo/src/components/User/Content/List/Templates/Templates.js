import React, { useEffect, useState } from "react";
import Select from "react-select";

import classes from "./Templates.module.css";

import TemplateItem from "./TemplateItem";

const Templates = (props) => {
  const [allPermutations, setAllPermutations] = useState([]);
  const [searchedApps, setSearchedApps] = useState({
    source: "",
    destination: "",
  });

  useEffect(() => {
    const per = [];

    props.apps.forEach((source_item) => {
      props.apps.forEach((destination_item) => {
        if (source_item.id !== destination_item.id)
          source_item.triggers.forEach((source_trigger) => {
            destination_item.actions.forEach((destination_action) => {
              per.push({
                id: per.length + 1,
                source: {
                  name: source_item.name,
                  img: source_item.img,
                  trigger: source_trigger,
                },
                destination: {
                  name: destination_item.name,
                  img: destination_item.img,
                  action: destination_action,
                },
              });
            });
          });
      });
    });

    setAllPermutations(per);
  }, []);

  return (
    <div className={classes["templates"]}>
      <div className={classes["templates__search-bar"]}>
        <div className={classes["search-bar__select-container"]}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="actions"
            options={props.apps
              .filter((e) => e.triggers.length !== 0)
              .map((e) => {
                return { label: e.name, value: e.name };
              })}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            menuPlacement="bottom"
            onChange={(e) => {
              if (e)
                setSearchedApps((prev) => {
                  return { ...prev, source: e.value };
                });
              else
                setSearchedApps((prev) => {
                  return { ...prev, source: "" };
                });
            }}
            placeholder="Search a source app..."
          />
        </div>
        <div className={classes["search-bar__select-container"]}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="actions"
            options={props.apps
              .filter((e) => e.actions.length !== 0)
              .map((e) => {
                return { label: e.name, value: e.name };
              })}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            menuPlacement="bottom"
            onChange={(e) => {
              if (e)
                setSearchedApps((prev) => {
                  return { ...prev, destination: e.value };
                });
              else
                setSearchedApps((prev) => {
                  return { ...prev, destination: "" };
                });
            }}
            placeholder="Search a destination app..."
          />
        </div>
      </div>
      <ul className={classes["templates__list"]}>
        {allPermutations
          .filter((permutation) => {
            let bool = true;
            if (searchedApps.source !== "")
              bool =
                bool && permutation.source.name.includes(searchedApps.source);
            if (searchedApps.destination !== "")
              bool =
                bool &&
                permutation.destination.name.includes(searchedApps.destination);
            return bool;
          })
          .map((permutation) => {
            return (
              <li
                key={permutation.id}
                onClick={(event) => {
                  props.onTemplateSelect(permutation);
                }}
              >
                <TemplateItem datas={permutation} />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Templates;
