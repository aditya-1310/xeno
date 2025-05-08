import React from 'react';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

interface RuleBuilderProps {
  onSave: (rules: RuleGroupType) => void;
  onPreview: (rules: RuleGroupType) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ onSave, onPreview }) => {
  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });

  const fields = [
    { name: 'lastActive', label: 'Last Active', type: 'date' },
    { name: 'totalSpent', label: 'Total Spent', type: 'number' },
    { name: 'visitCount', label: 'Visit Count', type: 'number' },
    { name: 'orderCount', label: 'Order Count', type: 'number' },
    { name: 'daysSinceLastOrder', label: 'Days Since Last Order', type: 'number' },
  ];

  const handleQueryChange = (newQuery: RuleGroupType) => {
    setQuery(newQuery);
    onSave(newQuery);
  };

  return (
    <div>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={handleQueryChange}
      />
    </div>
  );
};

export default RuleBuilder; 