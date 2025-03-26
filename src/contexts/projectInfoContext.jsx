import React, { createContext, useState, useContext } from 'react';

const ProjectInfoContext = createContext();

export const ProjectInfoProvider = ({ children }) => {
  const [projectName, setProjectName] = useState('');
  const [movieName, setMovieName] = useState('');

  return (
    <ProjectInfoContext.Provider value={{ projectName, setProjectName, movieName, setMovieName }}>
      {children}
    </ProjectInfoContext.Provider>
  );
};

export const useProjectInfo = () => {
  return useContext(ProjectInfoContext);
};







