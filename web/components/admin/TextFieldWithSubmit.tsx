import { Button } from 'antd';
import classNames from 'classnames';
import React, { FC, useContext, useEffect, useState } from 'react';
import { UpdateArgs } from '../../types/config-section';
import { postConfigUpdateToAPI, RESET_TIMEOUT } from '../../utils/config-constants';
import {
  createInputStatus,
  StatusState,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../utils/input-statuses';
import { ServerStatusContext } from '../../utils/server-status-context';
import { FormStatusIndicator } from './FormStatusIndicator';
import { TextField, TextFieldProps } from './TextField';

export const TEXTFIELD_TYPE_TEXTAREA = 'textarea';
export const TEXTFIELD_TYPE_URL = 'url';

export type TextFieldWithSubmitProps = TextFieldProps & {
  apiPath: string;
  configPath?: string;
  initialValue?: string;
  hasComplexityRequirements?: boolean;
};

export const TextFieldWithSubmit: FC<TextFieldWithSubmitProps> = ({
  apiPath,
  configPath = '',
  initialValue = '',
  useTrim,
  useTrimLead,
  ...textFieldProps // rest of props
}) => {
  const [submitStatus, setSubmitStatus] = useState<StatusState>(null);

  const [hasChanged, setHasChanged] = useState(false);

  const serverStatusData = useContext(ServerStatusContext);
  const { setFieldInConfigState } = serverStatusData || {};

  let resetTimer = null;

  const { fieldName, required, tip, status, value, hasComplexityRequirements, onChange, onSubmit } =
    textFieldProps;

  // Clear out any validation states and messaging
  const resetStates = () => {
    setSubmitStatus(null);
    setHasChanged(false);
    clearTimeout(resetTimer);
    resetTimer = null;
  };

  useEffect(() => {
    // TODO: Add native validity checks here, somehow
    // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
    // const hasValidity = (type !== TEXTFIELD_TYPE_NUMBER && e.target.validity.valid) || type === TEXTFIELD_TYPE_NUMBER ;
    if ((required && (value === '' || value === null)) || value === initialValue) {
      setHasChanged(false);
    } else {
      // show submit button
      resetStates();
      setHasChanged(true);
    }
  }, [value]);

  // if field is required but value is empty, or equals initial value, then don't show submit/update button. otherwise clear out any result messaging and display button.
  const handleChange = ({ fieldName: changedFieldName, value: changedValue }: UpdateArgs) => {
    if (onChange) {
      let newValue: string = changedValue;
      if (useTrim) {
        newValue = changedValue.trim();
      } else if (useTrimLead) {
        newValue = changedValue.replace(/^\s+/g, '');
      }
      onChange({
        fieldName: changedFieldName,
        value: newValue,
      });
    }
  };

  // if you blur a required field with an empty value, restore its original value in state (parent's state), if an onChange from parent is available.
  const handleBlur = ({ value: changedValue }: UpdateArgs) => {
    if (onChange && required && changedValue === '') {
      onChange({ fieldName, value: initialValue });
    }
  };

  // how to get current value of input
  const handleSubmit = async () => {
    if ((required && value !== '') || value !== initialValue) {
      setSubmitStatus(createInputStatus(STATUS_PROCESSING));

      await postConfigUpdateToAPI({
        apiPath,
        data: { value },
        onSuccess: () => {
          setFieldInConfigState({ fieldName, value, path: configPath });
          setSubmitStatus(createInputStatus(STATUS_SUCCESS));
        },
        onError: (message: string) => {
          setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${message}`));
        },
      });
      resetTimer = setTimeout(resetStates, RESET_TIMEOUT);

      // if an extra onSubmit handler was sent in as a prop, let's run that too.
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  const textfieldContainerClass = classNames({
    'textfield-with-submit-container': true,
    submittable: hasChanged,
  });

  return (
    <div className={textfieldContainerClass}>
      <div className="textfield-component">
        <TextField
          {...textFieldProps}
          onSubmit={null}
          onBlur={handleBlur}
          onChange={handleChange}
          onHandleSubmit={handleSubmit}
        />
      </div>
      <div className="formfield-container lower-container">
        <p className="label-spacer" />
        <div className="lower-content">
          <div className="field-tip">{tip}</div>
          <FormStatusIndicator status={status || submitStatus} />
          <div className="update-button-container">
            {!hasComplexityRequirements && (
              <Button
                type="primary"
                size="small"
                className="submit-button"
                onClick={handleSubmit}
                disabled={!hasChanged}
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
