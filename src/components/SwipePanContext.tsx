import React from 'react';
export const SwipePanContext = React.createContext<{ isPanning: boolean }>({ isPanning: false });