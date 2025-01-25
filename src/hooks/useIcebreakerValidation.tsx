import { questions } from "@/utils/questions";

export const useIcebreakerValidation = () => {
  const validateAndProcessFields = (userProfile: Record<string, string>) => {
    console.log('Starting validation with profile:', userProfile);
    
    const filledFields = Object.entries(userProfile)
      .filter(([_, value]) => {
        const trimmedValue = value?.toString().trim();
        return trimmedValue !== undefined && trimmedValue !== null && trimmedValue !== '';
      })
      .reduce((acc, [key, value]) => {
        // Find matching question across all categories
        const allQuestions = [
          ...questions.userTraits,
          ...questions.targetTraits,
          ...questions.generalInfo
        ];
        
        const question = allQuestions.find(q => q.id === key);
        
        if (question) {
          console.log(`Processing field ${key}:`, {
            value: value.trim(),
            prompt: question.prompt,
            priority: question.priority,
            questionText: question.text
          });
          
          return {
            ...acc,
            [key]: {
              value: value.trim(),
              prompt: question.prompt,
              priority: question.priority,
              questionText: question.text
            }
          };
        }
        console.warn(`Warning: No question definition found for field ${key}`);
        return acc;
      }, {});

    console.log('Final processed fields with priorities:', JSON.stringify(filledFields, null, 2));
    return filledFields;
  };

  return {
    validateAndProcessFields
  };
};