
import type { ListeningProfilePreset } from "../../types/listeningProfile";

interface ListeningProfilePresetsProps {
  presets: ListeningProfilePreset[];
  onApplyPreset: (preset: ListeningProfilePreset) => void;
}

export function ListeningProfilePresets({
  presets,
  onApplyPreset
}: ListeningProfilePresetsProps) {
  return (
    <section className="profile-panel">
      <div className="eyebrow">Presets</div>
      <div className="profile-presets">
        {presets.map((preset) => (
          <button key={preset.id} onClick={() => onApplyPreset(preset)}>
            <strong>{preset.name}</strong>
            <span>{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
