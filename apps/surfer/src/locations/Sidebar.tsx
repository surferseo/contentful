import { EntrySys, SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useRef, useState } from 'react';
import { SurferContainer } from '../components/SurferContainer';
import { useFieldSelection } from '../hooks/useFieldSelection';
import { useSurfer } from '../hooks/useSurfer';
import { SurferContext, SurferRpcCommands, SurferRpcMessage } from '../types';
import { useContentHtml } from '../hooks/useContentHtml';
import { useConfigurationDialog } from '../hooks/useConfigurationDialog';
import { Note } from '@contentful/f36-components';

const FULL_SIZE_PX = 550;
const WARNING_SIZE_PX = 70;
const EXPAND_BUTTON_SIZE_PX = 40;

const buildShareToken = ({ id, space }: EntrySys) => `${space.sys.id}_${id}`;

const Sidebar = () => {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const { entry, window } = useSDK<SidebarAppSDK>();
  const [selectedFields, FieldSelection, richTextFields] = useFieldSelection(Object.values(entry.fields));
  const contentHtml = useContentHtml(richTextFields, selectedFields);
  const widgetSizePx = richTextFields.length ? FULL_SIZE_PX : WARNING_SIZE_PX;
  const shareToken = buildShareToken(entry.getSys());
  const { openConfigurationDialog, isConfigurationOpen } = useConfigurationDialog(shareToken);

  const [isExpanded, setIsExpanded] = useState(true);

  const onReady = ({ setHtml, configureView }: SurferContext) => {
    setHtml(contentHtml);
    configureView({
      configurationToggleOverride: true,
    });
  };

  const onRpcMessage = (message: SurferRpcMessage, context: SurferContext) => {
    if (message.command.message === SurferRpcCommands.CONFIGURATION_TOGGLED) {
      openConfigurationDialog(context);
    }
  };

  const { isLoading, setHtml } = useSurfer(iframeContainerRef, 'guidelines', {
    shareToken,
    onReady,
    onRpcMessage,
  });

  useEffect(() => {
    window.updateHeight(widgetSizePx);
  }, [window, richTextFields, widgetSizePx]);

  useEffect(() => {
    setHtml?.(contentHtml);
  }, [contentHtml, setHtml]);

  useEffect(() => {
    window.updateHeight(isExpanded ? widgetSizePx : EXPAND_BUTTON_SIZE_PX);
  }, [isExpanded, widgetSizePx, window]);

  return richTextFields.length ? (
    <SurferContainer ref={iframeContainerRef} isLoading={isLoading || isConfigurationOpen} flex="2 0" isExpanded={isExpanded} toggleExpanded={setIsExpanded} />
  ) : (
    <Note variant="warning">Add a RichText field to enable Surfer!</Note>
  );
};

export default Sidebar;
