import React from "react";
import { QRCodeSVG } from "qrcode.react";

type QRCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

const QRCodeComponent: React.FC<QRCodeProps> = ({ value, size = 128, className }) => (
  <div className={className}>
    <QRCodeSVG value={value} size={size} />
  </div>
);

export default QRCodeComponent;
