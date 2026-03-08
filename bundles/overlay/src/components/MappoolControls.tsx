import { useMappoolControl } from '@/hooks/useMappoolControl';
import { useMappoolState } from '@/hooks/useMappoolState';
import { ControlPanelGroup } from './ControlPanel';
import panelStyles from './styles/ControlPanel.module.css';

export const MappoolControls = () => {
  const { resetMappool } = useMappoolState();
  const { control, setAutopick, setAutoadvance, setCurrentPicker } = useMappoolControl();

  return (
    <>
      <ControlPanelGroup title="Mappool controls">
        <button onClick={resetMappool}>Reset Mappool</button>
      </ControlPanelGroup>
      <ControlPanelGroup title="Autopick">
        <button
          className={control.autopickEnabled ? panelStyles.active : undefined}
          onClick={() => setAutopick(!control.autopickEnabled)}
        >
          Enable Autopick
        </button>
        <button
          className={control.currentPicker === 'red' ? panelStyles.active : undefined}
          onClick={() => setCurrentPicker('red')}
        >
          Red pick
        </button>
        <button
          className={control.currentPicker === 'blue' ? panelStyles.active : undefined}
          onClick={() => setCurrentPicker('blue')}
        >
          Blue pick
        </button>
      </ControlPanelGroup>
      <ControlPanelGroup title="Autoadvance">
        <button
          className={control.autoadvanceEnabled ? panelStyles.active : undefined}
          onClick={() => setAutoadvance(!control.autoadvanceEnabled)}
        >
          Enable Autoadvance
        </button>
      </ControlPanelGroup>
    </>
  );
};
