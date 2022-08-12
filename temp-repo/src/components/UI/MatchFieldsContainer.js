import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import { cloneDeep, isEmpty, isObject } from "lodash";

import classes from "./MatchFieldsContainer.module.css";

const convertInput = (inputObject, fieldDatas) => {
  let temporaryArray = [];

  for (const fieldId in inputObject) {
    let destinationField = fieldDatas.destination.find(
      (field) => field.value == inputObject[fieldId]
    );

    if (destinationField == null && fieldDatas.predefined[fieldId]) {
      destinationField = fieldDatas.destination.predefined[fieldId].find(
        (field) => field.value == fieldId
      );
    }

    let sourceField = fieldDatas.source.find((field) => field.value == fieldId);

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
        : { value: inputObject[fieldId], label: inputObject[fieldId] },
      source: sourceField
        ? {
            value: sourceField.value,
            label: sourceField.label,
          }
        : { value: fieldId, label: fieldId },
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
    { destination: {}, source: {} },
  ]);

  const appSelections = useSelector((state) => state.inputs.appSelections);

  const source_app = appSelections.source.app;
  const destination_app = appSelections.destination.app;

  useEffect(() => {
    if (props.default && !isEmpty(props.default))
      setMappingChoices(convertInput(props.default, props.datas));
  }, [props.datas, props.default]);

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
    <div
      key={props.key}
      className={`${classes["match-fields"]} py-5 border-b border-solid`}
    >
      <div className={`mb-2`}>
        <label
          className={`${classes["match-fields__title"]} block text-sm fonr-semibold`}
        >
          {props.label}
        </label>
      </div>
      <div className={`w-full`}>
        <div className={`mb-2 text-sm`}>
          <div
            className={`${classes["fields__title"]} items-center inline-block mt-1 text-xs line-height-xs align-middle font-normal`}
          >
            <div className="title-container flex">
              <img
                src={destination_app.url}
                height="15px"
                className="mr-1 max-h-4 max-w-full align-middle"
                alt={destination_app.name}
              />
              <div className={`inline-block align-middle text-xs`}>
                <span>{destination_app.name}</span>
              </div>
            </div>
          </div>
          <div
            className={`${classes["fields__title"]} ${classes["fields__title--right"]} float-right items-center inline-block mt-1 text-xs line-height-xs align-middle font-normal`}
          >
            <div className="title-container flex">
              <img
                src={source_app.url}
                height="15px"
                className="mr-1 max-h-4 max-w-full align-middle"
                alt={source_app.name}
              />
              <div className={`inline-block align-middle text-xs`}>
                <span>{source_app.name}</span>
              </div>
            </div>
          </div>
          {mappingChoices.map((choice, index) => {
            return (
              <div className={`relative mb-2`} key={index}>
                <div
                  className={`${classes["mapping-connection-line"]} bg-white border-t border-solid left-0 w-full absolute top-1/2`}
                >
                  {" "}
                </div>
                <div className={`${classes["mapping__leftside"]} inline-block`}>
                  <div className={`relative`}>
                    <div className={`relative`}>
                      {props.inputTypes.destination === "select" ? (
                        <Select
                          className={`basic-multi-select`}
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
                      ) : (
                        <input
                          className="h-9 w-full border border-solid radius-md py-px px-3"
                          style={{ borderColor: "rgb(204, 204, 204)" }}
                          placeholder="Enter Column Name"
                          value={choice.destination.value}
                          onChange={(event) => {
                            let temp = cloneDeep(mappingChoices);
                            temp[index] = {
                              ...temp[index],
                              destination: {
                                value: event.target.value,
                                label: event.target.value,
                              },
                            };
                            setMappingChoices(temp);
                            if (choice.source.value) {
                              props.onChange(convertOutput(temp));
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={`${classes["mapping__rightside"]} float-right`}>
                  <div className={`relative`}>
                    <div className={`relative`}>
                      {props.inputTypes.source === "select" ? (
                        <Select
                          className={`basic-multi-select`}
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
                      ) : (
                        <input />
                      )}
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
                "cursor-not-allowed opacity-50"
              } radius cursor-pointer color-white inline-block text-xs h-7 py-1 px-4 text-center`}
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
