// components/MqttListener.jsx
import { useEffect } from 'react';
import mqtt from 'mqtt';

const MqttListener = ({ onStart }) => {
	useEffect(() => {
		const client = mqtt.connect('ws://fitbox.bounceme.net:9001', {
			clientId: 'web-' + Math.random().toString(16).slice(2, 8),
		});

		client.on('connect', () => {
			console.log('✅ Подключено к MQTT');
			client.subscribe('fitbox/start');
		});

		client.on('message', (topic, message) => {
			if (topic === 'fitbox/start') {
				console.log('📶 Получено fitbox/start');
				onStart(); // Запускаем музыку
			}
		});

		client.on('error', (err) => {
			console.error('❌ MQTT ошибка:', err);
		});

		return () => client.end(true);
	}, [onStart]);

	return null;
};

export default MqttListener;
