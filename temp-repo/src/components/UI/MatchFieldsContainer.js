import { isEmpty } from "lodash";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

import Select from "react-select";

import classes from "./MatchFieldsContainer.module.css";

const convertInput = (inputObject, fieldDatas) => {
  let temporaryArray = [];

  for (const fieldId in inputObject) {
    const destinationField = fieldDatas.destination.find(
      (field) => field.value == inputObject[fieldId]
    );

    if (destinationField == null && fieldDatas.predefined[fieldId]) {
      destinationField = fieldDatas.destination.predefined[fieldId].find(
        (field) => field.value == fieldId
      );
    }

    const sourceField = fieldDatas.source.find(
      (field) => field.value == fieldId
    );
    if (sourceField == null && fieldDatas.predefined[inputObject[fieldId]])
      sourceField = fieldDatas.predefined[inputObject[fieldId]].find(
        (field) => field.value == fieldId
      );

    temporaryArray.push({
      destination: destinationField
        ? {
            value: destinationField.value,
            label: destinationField.label,
          }
        : {},
      source: sourceField
        ? {
            value: sourceField.value,
            label: sourceField.label,
          }
        : {},
    });
  }

  return temporaryArray;
};

const convertOutput = (outputArray) => {
  let temporaryObject = {};

  for (var element of outputArray)
    temporaryObject[element.source.value] = element.destination.value;

  return temporaryObject;
};

const MatchFieldsContainer = (props) => {
  const [mappingChoices, setMappingChoices] = useState([
    { destination: { value: "name", label: "Name" }, source: {} },
  ]);

  useEffect(() => {
    if (props.default && !isEmpty(props.default))
      setMappingChoices(convertInput(props.default, props.datas));
  }, []);

  const destinationRequiredOptions = props.datas.destination.filter(
    (option) => {
      if (props.default)
        return !Object.values(props.default).includes(option.value);
      return true;
    }
  );

  const sourceRequiredOptions = props.datas.source.filter((option) => {
    if (props.default) return !(option.value in props.default);
    return true;
  });

  return (
    <div className={classes["match-fields"]}>
      <div className={classes["match-fields__title"]}>
        <label>{props.label}</label>
      </div>
      <div className={classes["match-fields__container"]}>
        <div className={classes["match-fields__fields"]}>
          <div className={classes["fields__title"]}>
            <img src={props.apps.destination.img} />
            <div className={classes["fields__text"]}>
              <span>{props.apps.destination.name}</span>
            </div>
          </div>
          <div
            className={`${classes["fields__title"]} ${classes["fields__title--right"]}`}
          >
            <img src={props.apps.source.img} />
            <div className={classes["fields__text"]}>
              <span>{props.apps.source.name}</span>
            </div>
          </div>
          {mappingChoices.map((choice, index) => {
            return (
              <div className={classes["match-fields__mapping"]} key={index}>
                <div className={classes["mapping__leftside"]}>
                  <div className={classes["mapping__dropdown"]}>
                    <div className={classes["dropdown__wrapper"]}>
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isSearchable={true}
                        name="actions"
                        options={destinationRequiredOptions}
                        placeholder="Please select..."
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9998 }),
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="bottom"
                        onChange={(value) => {
                          let temp = [...mappingChoices];
                          temp[index] = {
                            ...temp[index],
                            destination: value,
                          };
                          setMappingChoices(temp);
                          if (choice.source.value) {
                            props.onChange(convertOutput(temp));
                          }
                        }}
                        value={choice.destination}
                      />
                    </div>
                  </div>
                </div>
                <div className={classes["mapping__rightside"]}>
                  <div className={classes["mapping__dropdown"]}>
                    <div className={classes["dropdown__wrapper"]}>
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Please select..."
                        isSearchable={true}
                        name="actions"
                        options={
                          !isEmpty(choice.destination) &&
                          props.datas.predefined[choice.destination.value]
                            ? [
                                ...props.datas.predefined[
                                  choice.destination.value
                                ],
                                ...sourceRequiredOptions,
                              ]
                            : sourceRequiredOptions
                        }
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9998 }),
                        }}
                        menuPortalTarget={document.body}
                        menuPlacement="bottom"
                        onChange={(value) => {
                          let temp = [...mappingChoices];
                          temp[index] = {
                            ...temp[index],
                            source: value,
                          };
                          setMappingChoices(temp);
                          props.onChange(convertOutput(temp));
                        }}
                        value={choice.source}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className={classes["match-fields__add-mapping"]}>
            <button
              className={`${
                (mappingChoices.find(
                  (element) =>
                    !element.destination.label || !element.source.label
                ) ||
                  mappingChoices.length >= props.maxLength) &&
                classes["disabled"]
              }`}
              onClick={(event) => {
                if (
                  !mappingChoices.find(
                    (element) =>
                      !element.destination.label || !element.source.label
                  ) &&
                  mappingChoices.length < props.maxLength
                ) {
                  setMappingChoices((prev) => {
                    return [...mappingChoices, { source: {}, destination: {} }];
                  });
                }
              }}
            >
              + Add new field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchFieldsContainer;
