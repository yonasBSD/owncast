import React, { useState, useContext, useEffect } from 'react';
import { Typography, Table, Button, Modal, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dynamic from 'next/dynamic';
import { SocialDropdown } from '../../SocialDropdown';
import { fetchData, SOCIAL_PLATFORMS_LIST } from '../../../../utils/apis';
import { ServerStatusContext } from '../../../../utils/server-status-context';
import {
  API_SOCIAL_HANDLES,
  postConfigUpdateToAPI,
  RESET_TIMEOUT,
  DEFAULT_SOCIAL_HANDLE,
  OTHER_SOCIAL_HANDLE_OPTION,
} from '../../../../utils/config-constants';
import { SocialHandle, UpdateArgs } from '../../../../types/config-section';
import {
  isValidAccount,
  isValidUrl,
  DEFAULT_TEXTFIELD_URL_PATTERN,
} from '../../../../utils/validators';
import { TextField } from '../../TextField';
import {
  createInputStatus,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../../../utils/input-statuses';
import { FormStatusIndicator } from '../../FormStatusIndicator';

const { Title } = Typography;

// Lazy loaded components

const CaretDownOutlined = dynamic(() => import('@ant-design/icons/CaretDownOutlined'), {
  ssr: false,
});

const CaretUpOutlined = dynamic(() => import('@ant-design/icons/CaretUpOutlined'), {
  ssr: false,
});

const DeleteOutlined = dynamic(() => import('@ant-design/icons/DeleteOutlined'), {
  ssr: false,
});

// eslint-disable-next-line react/function-component-definition
export default function EditSocialLinks() {
  const [availableIconsList, setAvailableIconsList] = useState([]);
  const [currentSocialHandles, setCurrentSocialHandles] = useState([]);

  const [displayModal, setDisplayModal] = useState(false);
  const [displayOther, setDisplayOther] = useState(false);
  const [modalProcessing, setModalProcessing] = useState(false);
  const [editId, setEditId] = useState(-1);

  // current data inside modal
  const [modalDataState, setModalDataState] = useState(DEFAULT_SOCIAL_HANDLE);

  const [submitStatus, setSubmitStatus] = useState(null);

  const serverStatusData = useContext(ServerStatusContext);
  const { serverConfig, setFieldInConfigState } = serverStatusData || {};

  const { instanceDetails } = serverConfig;
  const { socialHandles: initialSocialHandles } = instanceDetails;

  let resetTimer = null;

  const PLACEHOLDERS = {
    mastodon: 'https://mastodon.social/@username',
    twitter: 'https://twitter.com/username',
  };

  const getAvailableIcons = async () => {
    try {
      const result = await fetchData(SOCIAL_PLATFORMS_LIST, { auth: false });
      const list = Object.keys(result).map(item => ({
        key: item,
        ...result[item],
      }));
      setAvailableIconsList(list);
    } catch (error) {
      console.log(error);
      //  do nothing
    }
  };

  const isPredefinedSocial = (platform: string) =>
    availableIconsList.find(item => item.key === platform) || false;

  const selectedOther =
    modalDataState.platform !== '' &&
    !availableIconsList.find(item => item.key === modalDataState.platform);

  useEffect(() => {
    getAvailableIcons();
  }, []);

  useEffect(() => {
    if (instanceDetails.socialHandles) {
      setCurrentSocialHandles(initialSocialHandles);
    }
  }, [instanceDetails]);

  const resetStates = () => {
    setSubmitStatus(null);
    resetTimer = null;
    clearTimeout(resetTimer);
  };
  const resetModal = () => {
    setDisplayModal(false);
    setEditId(-1);
    setDisplayOther(false);
    setModalProcessing(false);
    setModalDataState({ ...DEFAULT_SOCIAL_HANDLE });
  };

  const handleModalCancel = () => {
    resetModal();
  };

  const updateModalState = (fieldName: string, value: string) => {
    setModalDataState({
      ...modalDataState,
      [fieldName]: value,
    });
  };
  const handleDropdownSelect = (value: string) => {
    if (value === OTHER_SOCIAL_HANDLE_OPTION) {
      setDisplayOther(true);
      updateModalState('platform', '');
    } else {
      setDisplayOther(false);
      updateModalState('platform', value);
    }
  };
  const handleOtherNameChange = event => {
    const { value } = event.target;
    updateModalState('platform', value);
  };

  const handleUrlChange = ({ value }: UpdateArgs) => {
    updateModalState('url', value);
  };

  // posts all the variants at once as an array obj
  const postUpdateToAPI = async (postValue: any) => {
    if (!displayModal) {
      // only create the processing status if the modal is inactive
      resetTimer = null;
      setSubmitStatus(createInputStatus(STATUS_PROCESSING));
    }
    await postConfigUpdateToAPI({
      apiPath: API_SOCIAL_HANDLES,
      data: { value: postValue },
      onSuccess: () => {
        setFieldInConfigState({
          fieldName: 'socialHandles',
          value: postValue,
          path: 'instanceDetails',
        });

        // close modal
        setModalProcessing(false);
        handleModalCancel();

        setSubmitStatus(createInputStatus(STATUS_SUCCESS));

        resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
      },
      onError: (message: string) => {
        setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${message}`));
        setModalProcessing(false);
        resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
      },
    });
  };

  // on Ok, send all of dataState to api
  // show loading
  // close modal when api is done
  const handleModalOk = () => {
    setModalProcessing(true);
    const postData = currentSocialHandles.length ? [...currentSocialHandles] : [];
    if (editId === -1) {
      postData.push(modalDataState);
    } else {
      postData.splice(editId, 1, modalDataState);
    }
    postUpdateToAPI(postData);
  };

  const handleDeleteItem = (index: number) => {
    const postData = [...currentSocialHandles];
    postData.splice(index, 1);
    postUpdateToAPI(postData);
  };

  const handleMoveItemUp = (index: number) => {
    if (index <= 0 || index >= currentSocialHandles.length) {
      return;
    }
    const postData = [...currentSocialHandles];
    const tmp = postData[index - 1];
    postData[index - 1] = postData[index];
    postData[index] = tmp;
    postUpdateToAPI(postData);
  };

  const handleMoveItemDown = (index: number) => {
    if (index < 0 || index >= currentSocialHandles.length - 1) {
      return;
    }
    const postData = [...currentSocialHandles];
    const tmp = postData[index + 1];
    postData[index + 1] = postData[index];
    postData[index] = tmp;
    postUpdateToAPI(postData);
  };

  const socialHandlesColumns: ColumnsType<SocialHandle> = [
    {
      title: 'Social Link',
      dataIndex: '',
      key: 'combo',
      render: (_, record) => {
        const { platform, url } = record;
        const platformInfo = isPredefinedSocial(platform);

        // custom platform case
        if (!platformInfo) {
          return (
            <div className="social-handle-cell">
              <p className="option-label">
                <strong>{platform}</strong>
                <span className="handle-url" title={url}>
                  {url}
                </span>
              </p>
            </div>
          );
        }
        const { icon, platform: platformName } = platformInfo;
        return (
          <div className="social-handle-cell">
            <span className="option-icon">
              <img src={icon} alt="" className="option-icon" />
            </span>
            <p className="option-label">
              <strong>{platformName}</strong>
              <span className="handle-url" title={url}>
                {url}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'edit',
      render: (_, _record, index) => (
        <div className="actions">
          <Button
            size="small"
            onClick={() => {
              const platformInfo = currentSocialHandles[index];
              setEditId(index);
              setModalDataState({ ...platformInfo });
              setDisplayModal(true);
              if (!isPredefinedSocial(platformInfo.platform)) {
                setDisplayOther(true);
              }
            }}
          >
            Edit
          </Button>
          <Button
            icon={<CaretUpOutlined />}
            size="small"
            hidden={index === 0}
            onClick={() => handleMoveItemUp(index)}
          />
          <Button
            icon={<CaretDownOutlined />}
            size="small"
            hidden={index === currentSocialHandles.length - 1}
            onClick={() => handleMoveItemDown(index)}
          />
          <Button
            className="delete-button"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteItem(index)}
          />
        </div>
      ),
    },
  ];

  const isValid = (url: string, platform: string) => {
    if (platform === '') {
      return false;
    }
    if (platform === 'xmpp') {
      return isValidAccount(url, 'xmpp');
    }

    return isValidUrl(url);
  };

  const okButtonProps = {
    disabled: !isValid(modalDataState.url, modalDataState.platform),
  };

  const otherField = (
    <div className="other-field-container formfield-container">
      <div className="label-side" />
      <div className="input-side">
        <Input
          placeholder="Other platform name"
          defaultValue={modalDataState.platform}
          onChange={handleOtherNameChange}
        />
      </div>
    </div>
  );

  return (
    <div className="social-links-edit-container">
      <Title level={3} className="section-title">
        Your Social Handles
      </Title>
      <p className="description">
        Add all your social media handles and links to your other profiles here.
      </p>

      <FormStatusIndicator status={submitStatus} />

      <Table
        className="social-handles-table"
        pagination={false}
        size="small"
        rowKey={record => `${record.platform}-${record.url}`}
        columns={socialHandlesColumns}
        dataSource={currentSocialHandles}
      />

      <Modal
        title="Edit Social Handle"
        open={displayModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalProcessing}
        okButtonProps={okButtonProps}
      >
        <div className="social-handle-modal-content">
          <SocialDropdown
            iconList={availableIconsList}
            selectedOption={selectedOther ? OTHER_SOCIAL_HANDLE_OPTION : modalDataState.platform}
            onSelected={handleDropdownSelect}
          />
          {displayOther && otherField}
          <br />
          <TextField
            fieldName="social-url"
            label="URL"
            placeholder={PLACEHOLDERS[modalDataState.platform] || 'Url to page'}
            value={modalDataState.url}
            onChange={handleUrlChange}
            useTrim
            type="url"
            pattern={DEFAULT_TEXTFIELD_URL_PATTERN}
          />
          <FormStatusIndicator status={submitStatus} />
        </div>
      </Modal>
      <br />
      <Button
        type="primary"
        onClick={() => {
          resetModal();
          setDisplayModal(true);
        }}
      >
        Add a new social link
      </Button>
    </div>
  );
}
