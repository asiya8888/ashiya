import type { ReactNode } from 'react';

type SceneHotspotProps = {
  children: ReactNode;
  className: string;
  disabled: boolean;
  onClick: () => void;
};

export function SceneHotspot({ children, className, disabled, onClick }: SceneHotspotProps) {
  return (
    <button className={`scene-hotspot ${className}`} disabled={disabled} onClick={onClick} type="button">
      <span>{children}</span>
    </button>
  );
}
