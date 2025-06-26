import { CheckCircle } from 'lucide-react';

const features = ['15g eiwit per portie', 'elektrolyten uit kokoswaterpoeder en zout', 'bevat geen additieven'];

export default function ProductFeatures() {
  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
  );
}
