export interface Artwork {
  id: string;
  title: string;
  description: string;
  /** Suport: pânză, foaie cartonată etc. */
  supportMaterial: string;
  /** Dimensiuni fizice ale lucrării */
  dimensions: string;
  /** Tip culori: acrilice, acuarelă, amestec */
  colorType: string;
  /** Marcă / calitate culori */
  paintBrand: string;
  videoUrl: string;
  imageUrl: string;
}

export type SceneState = 'intro_1' | 'intro_2' | 'intro_3' | 'intro_4' | 'intro_5' | 'gallery';

export interface SceneConfig {
  id: SceneState;
  videoUrl: string;
  loop: boolean;
  actionText?: string;
  actionType?: 'tap' | 'swipe' | 'hold' | 'auto';
  mapText?: string;
}
