"use client";

import { WorkerRateHistoryItem } from "@/types/worker";
import { format } from "date-fns";

interface WorkerRateHistoryProps {
  rateHistory: WorkerRateHistoryItem[];
}

export function WorkerRateHistory({ rateHistory }: WorkerRateHistoryProps) {
  if (rateHistory.length === 0) {
    return (
      <div className="text-center text-gray-500 my-4">
        No rate changes recorded yet.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Rate History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previous Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rateHistory.map((history) => {
              const oldRate = Number(history.old_rate);
              const newRate = Number(history.new_rate);
              const change = newRate - oldRate;
              const changePercentage = ((change / oldRate) * 100).toFixed(1);
              
              return (
                <tr key={history.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(history.changed_at), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${oldRate.toFixed(2)}/hr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${newRate.toFixed(2)}/hr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex text-sm ${
                        change >= 0
                          ? "text-green-800 bg-green-100"
                          : "text-red-800 bg-red-100"
                      } px-2 py-1 rounded-full`}
                    >
                      {change >= 0 ? "+" : ""}
                      ${change.toFixed(2)} ({change >= 0 ? "+" : ""}
                      {changePercentage}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
