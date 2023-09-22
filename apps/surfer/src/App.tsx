import { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import Dialog from './locations/Dialog';
import Sidebar from './locations/Sidebar';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ConfigScreen } from './locations/ConfigScreen';
import { EntryField } from './locations/EntryField';

const ComponentLocationSettings = {
  [locations.LOCATION_DIALOG]: Dialog,
  [locations.LOCATION_ENTRY_SIDEBAR]: Sidebar,
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_ENTRY_FIELD]: EntryField,
};

const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    for (const [location, component] of Object.entries(ComponentLocationSettings)) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
