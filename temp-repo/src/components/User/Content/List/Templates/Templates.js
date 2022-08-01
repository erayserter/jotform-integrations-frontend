import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

import classes from "./Templates.module.css";

import TemplateItem from "./TemplateItem";

import { useDispatch } from "react-redux";
import {
  setIsTemplate,
  setIsIntegrationContent,
} from "../../../../../store/ui";
import { setAppSelections } from "../../../../../store/inputs";

const Templates = (props) => {
  const dispatch = useDispatch();

  const apps = useSelector((state) => state.apps.apps);
  const appSelections = useSelector((state) => state.inputs.appSelections);

  const [allPermutations, setAllPermutations] = useState([]);
  const [searchedApps, setSearchedApps] = useState({
    source: "",
    destination: "",
  });

  const onTemplateSelect = (permutation) => {
    dispatch(setIsTemplate({ isTemplate: true }));

    const sourceSettings = {};
    for (const field of permutation.trigger.getAllFields()) {
      if (field.templateDefault)
        sourceSettings[field.selection] = field.templateDefault;
    }
    const destinationSettings = {};
    for (const field of permutation.action.getAllFields()) {
      if (field.templateDefault)
        destinationSettings[field.selection] = field.templateDefault;
    }

    dispatch(
      setAppSelections({
        appSelections: {
          ...appSelections,
          name: "Template Integration",
          source: {
            app: permutation.source_item,
            action: permutation.trigger,
            key: null,
            auth_id: null,
          },
          destination: {
            app: permutation.destination_item,
            action: permutation.action,
            key: null,
            auth_id: null,
          },
        },
      })
    );

    dispatch(setIsIntegrationContent({ isIntegrationContent: true }));
  };

  useEffect(() => {
    const per = [];

    for (const source_item in apps) {
      for (const destination_item in apps) {
        const source = apps[source_item];
        const destination = apps[destination_item];
        if (source.id !== destination.id) {
          source.triggers.forEach((source_trigger) => {
            destination.actions.forEach((destination_action) => {
              per.push({
                id: per.length + 1,
                source_item: source,
                trigger: source_trigger,
                destination_item: destination,
                action: destination_action,
              });
            });
          });
        }
      }
    }

    setAllPermutations(per);
  }, [apps]);

  return (
    <div className={`${classes["templates"]} h-full overflow-auto`}>
      <div
        className={`${classes["templates__search-bar"]} flex justify-center items-center border-b border-solid border-navy-100 py-3 px-5 gap-3`}
      >
        <div className={`${classes["search-bar__select-container"]} w-full`}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="actions"
            options={Object.values(apps)
              .filter((e) => e.triggers.length !== 0)
              .map((e) => {
                return { label: e.name, value: e.id };
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
        <div className={`${classes["search-bar__select-container"]} w-full`}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="actions"
            options={Object.values(apps)
              .filter((e) => e.actions.length !== 0)
              .map((e) => {
                return { label: e.name, value: e.id };
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
      <ul
        className={`${classes["templates__list"]} flex justify-center items-center gap-3 py-4 px-5 flex-wrap`}
      >
        {allPermutations
          .filter((permutation) => {
            let bool = true;
            if (searchedApps.source !== "")
              bool =
                bool &&
                permutation.source_item.id.includes(searchedApps.source);
            if (searchedApps.destination !== "")
              bool =
                bool &&
                permutation.destination_item.id.includes(
                  searchedApps.destination
                );
            return bool;
          })
          .map((permutation) => {
            return (
              <li
                className="cursor-pointer transform ease-in-out duration-300"
                key={permutation.id}
                onClick={(event) => {
                  onTemplateSelect(permutation);
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
