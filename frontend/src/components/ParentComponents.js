import React from 'react';
import { useParams } from 'react-router-dom';
import CropReadinessUpdateForm from './CropReadinessUpdateForm';

const ParentComponent = () => {
    const { notificationId } = useParams(); // Get notificationId from URL

    console.log('Notification ID from URL:', notificationId); // Debugging

    return (
        <div>
            {notificationId ? (
                <CropReadinessUpdateForm notificationId={notificationId} />
            ) : (
                <div>No Notification ID Found</div>
            )}
        </div>
    );
};

export default ParentComponent;
