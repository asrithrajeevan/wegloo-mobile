import React from 'react';

interface IIfProps {
  condition?: boolean;
}

const If: React.FC<IIfProps> = ({condition, children}) => {
  return condition ? <>{children}</> : null;
};

export default If;
