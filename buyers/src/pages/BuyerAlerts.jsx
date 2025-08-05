import { useEffect, useState } from 'react';
import AlertCard from '../components/AlertCard';

const BuyerAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Dummy data for alerts (matched listings)
    const dummyAlerts = [
      {
        _id: 'a1',
        produce: 'Cabbage',
        quantity: 40,
        price: 20,
        imageUrl: 'https://via.placeholder.com/150',
        location: 'Nagpur',
        farmerName: 'Lakshmi',
        urgency: 'Tomorrow',
      },
      {
        _id: 'a2',
        produce: 'Brinjal',
        quantity: 30,
        price: 22,
        imageUrl: 'https://via.placeholder.com/150',
        location: 'Wardha',
        farmerName: 'Kishore',
        urgency: 'Same Day',
      },
      {
        _id: 'a3',
        produce: 'Potatoes',
        quantity: 100,
        price: 16,
        imageUrl: 'https://via.placeholder.com/150',
        location: 'Amravati',
        farmerName: 'Nirmala',
        urgency: '2 days',
      },
    ];

    setAlerts(dummyAlerts);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Nearby Produce Alerts</h1>
      <div className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert._id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default BuyerAlerts;
