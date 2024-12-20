import React from 'react';
import ProjectTabs from '../projectTabs/projectTabs';
import VideoUploader from '../videoUploader/VideoUploader';



// ViewProject Component
function ViewProject() {
    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-md-12">
                    <VideoUploader />
                </div>
            </div>
            <div className='row'>
                <div className="col-md-10">

                    <ProjectTabs />
                </div>
                <div className="col-md-2">
                    <div>Add Trailer</div>
                </div>
            </div>




        </div>
    );
}

export default ViewProject;
