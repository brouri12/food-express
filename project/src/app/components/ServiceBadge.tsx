interface ServiceBadgeProps {
  services: string[];
}

export default function ServiceBadge({ services }: ServiceBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {services.map((service, index) => (
        <span
          key={index}
          className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium"
        >
          🔌 API: {service}
        </span>
      ))}
    </div>
  );
}
