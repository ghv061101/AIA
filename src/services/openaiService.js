import openai from './openaiClient';

/**
 * Generates interview questions based on candidate profile and job requirements
 * @param {Object} candidateInfo - Candidate information including skills and experience
 * @param {string} difficulty - Question difficulty level (Easy, Medium, Hard)
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} Generated interview questions
 */
export async function generateInterviewQuestions(candidateInfo, difficulty = 'Medium', count = 1) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interviewer. Generate ${difficulty} level interview questions for a software developer position. Focus on practical, real-world scenarios that test both knowledge and problem-solving skills.`
        },
        {
          role: 'user',
          content: `Generate ${count} ${difficulty} level interview question(s) for a candidate with the following profile:
          
          Name: ${candidateInfo?.name || 'Not specified'}
          Skills: ${candidateInfo?.skills?.join(', ') || candidateInfo?.rawInfo || 'General software development'}
          Experience Level: Based on resume content
          
          The questions should be:
          - Technically accurate and relevant
          - Appropriate for ${difficulty} difficulty level
          - Test both conceptual knowledge and practical application
          - Include specific scenarios or examples when appropriate`
        },
      ],
      reasoning_effort: 'medium',
      verbosity: 'medium',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'interview_questions',
          schema: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    question: { type: 'string' },
                    difficulty: { type: 'string' },
                    category: { type: 'string' },
                    expectedPoints: { 
                      type: 'array',
                      items: { type: 'string' }
                    },
                    timeLimit: { type: 'number' }
                  },
                  required: ['id', 'question', 'difficulty', 'category', 'expectedPoints', 'timeLimit']
                }
              }
            },
            required: ['questions'],
            additionalProperties: false
          }
        }
      }
    });

    const result = JSON.parse(response?.choices?.[0]?.message?.content);
    return result?.questions;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw error;
  }
}

/**
 * Evaluates candidate's answer using AI analysis
 * @param {string} question - The interview question
 * @param {string} answer - Candidate's answer
 * @param {string} difficulty - Question difficulty level
 * @returns {Promise<Object>} Evaluation results with score and feedback
 */
export async function evaluateAnswer(question, answer, difficulty) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interviewer evaluating candidate responses. Provide fair, constructive feedback that helps candidates understand their strengths and areas for improvement. Consider the difficulty level when scoring.`
        },
        {
          role: 'user',
          content: `Evaluate this candidate's answer to a ${difficulty} level question:

          Question: ${question}
          
          Candidate's Answer: ${answer}
          
          Please provide a comprehensive evaluation including:
          - Technical accuracy of the response
          - Completeness of the answer
          - Problem-solving approach
          - Communication clarity
          - Areas of strength
          - Areas for improvement
          - Suggestions for further learning`
        }
      ],
      reasoning_effort: 'high',
      verbosity: 'high',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'answer_evaluation',
          schema: {
            type: 'object',
            properties: {
              score: { 
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Score out of 100'
              },
              feedback: { type: 'string' },
              strengths: {
                type: 'array',
                items: { type: 'string' }
              },
              improvements: {
                type: 'array',
                items: { type: 'string' }
              },
              technicalAccuracy: {
                type: 'number',
                minimum: 0,
                maximum: 10
              },
              completeness: {
                type: 'number',
                minimum: 0,
                maximum: 10
              },
              clarity: {
                type: 'number',
                minimum: 0,
                maximum: 10
              },
              recommendations: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['score', 'feedback', 'strengths', 'improvements', 'technicalAccuracy', 'completeness', 'clarity', 'recommendations'],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
}

/**
 * Generates comprehensive interview summary and final evaluation
 * @param {Array} interviewAnswers - All answers from the interview
 * @param {Object} candidateInfo - Candidate information
 * @returns {Promise<Object>} Complete interview evaluation
 */
export async function generateInterviewSummary(interviewAnswers, candidateInfo) {
  try {
    const answersText = interviewAnswers?.map((answer, index) => 
      `Question ${index + 1} (${answer?.difficulty}): ${answer?.question}
      Answer: ${answer?.answer}`
    )?.join('\n\n');

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a senior technical interviewer creating a comprehensive evaluation report. Provide balanced, professional assessment that considers the candidate\'s overall performance, potential, and fit for the role.'
        },
        {
          role: 'user',
          content: `Create a comprehensive interview summary for this candidate:

          Candidate Information:
          Name: ${candidateInfo?.name}
          Email: ${candidateInfo?.email}
          
          Interview Responses:
          ${answersText}
          
          Please provide a thorough evaluation including:
          - Overall performance assessment
          - Technical competency analysis
          - Strengths and growth areas
          - Hiring recommendation
          - Salary/level recommendations
          - Next steps in the interview process`
        }
      ],
      reasoning_effort: 'high',
      verbosity: 'high',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'interview_summary',
          schema: {
            type: 'object',
            properties: {
              overallScore: {
                type: 'number',
                minimum: 0,
                maximum: 100
              },
              recommendation: {
                type: 'string',
                enum: ['Strong Hire', 'Hire', 'No Hire', 'Strong No Hire']
              },
              summary: { type: 'string' },
              technicalSkills: {
                type: 'object',
                properties: {
                  score: { type: 'number', minimum: 0, maximum: 10 },
                  assessment: { type: 'string' }
                },
                required: ['score', 'assessment']
              },
              problemSolving: {
                type: 'object',
                properties: {
                  score: { type: 'number', minimum: 0, maximum: 10 },
                  assessment: { type: 'string' }
                },
                required: ['score', 'assessment']
              },
              communication: {
                type: 'object',
                properties: {
                  score: { type: 'number', minimum: 0, maximum: 10 },
                  assessment: { type: 'string' }
                },
                required: ['score', 'assessment']
              },
              strengths: {
                type: 'array',
                items: { type: 'string' }
              },
              areasForImprovement: {
                type: 'array',
                items: { type: 'string' }
              },
              levelRecommendation: {
                type: 'string',
                enum: ['Junior', 'Mid-level', 'Senior', 'Lead', 'Principal']
              },
              nextSteps: {
                type: 'array',
                items: { type: 'string' }
              },
              interviewerNotes: { type: 'string' }
            },
            required: ['overallScore', 'recommendation', 'summary', 'technicalSkills', 'problemSolving', 'communication', 'strengths', 'areasForImprovement', 'levelRecommendation', 'nextSteps', 'interviewerNotes'],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating interview summary:', error);
    throw error;
  }
}

/**
 * Extracts structured information from resume content
 * @param {string} resumeText - Raw text extracted from resume
 * @returns {Promise<Object>} Structured candidate information
 */
export async function analyzeResume(resumeText) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser. Extract structured information from resume content accurately and comprehensively.'
        },
        {
          role: 'user',
          content: `Parse this resume content and extract structured information:

          ${resumeText}
          
          Extract all relevant information including contact details, skills, experience, education, and any other pertinent details for a technical interview.`
        }
      ],
      reasoning_effort: 'medium',
      verbosity: 'medium',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resume_analysis',
          schema: {
            type: 'object',
            properties: {
              contactInfo: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  location: { type: 'string' },
                  linkedin: { type: 'string' },
                  github: { type: 'string' }
                }
              },
              skills: {
                type: 'object',
                properties: {
                  technical: { type: 'array', items: { type: 'string' } },
                  languages: { type: 'array', items: { type: 'string' } },
                  frameworks: { type: 'array', items: { type: 'string' } },
                  tools: { type: 'array', items: { type: 'string' } }
                }
              },
              experience: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    company: { type: 'string' },
                    duration: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              },
              education: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    degree: { type: 'string' },
                    institution: { type: 'string' },
                    year: { type: 'string' }
                  }
                }
              },
              experienceLevel: {
                type: 'string',
                enum: ['Entry Level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Principal']
              },
              summary: { type: 'string' }
            },
            required: ['contactInfo', 'skills', 'experience', 'education', 'experienceLevel', 'summary'],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

/**
 * Generates personalized interview feedback and next steps
 * @param {Object} evaluationResults - Complete evaluation results
 * @param {Object} candidateInfo - Candidate information
 * @returns {Promise<Object>} Personalized feedback and recommendations
 */
export async function generatePersonalizedFeedback(evaluationResults, candidateInfo) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a career coach providing constructive, encouraging feedback to help candidates improve their technical skills and interview performance.'
        },
        {
          role: 'user',
          content: `Create personalized feedback for this candidate based on their interview performance:

          Candidate: ${candidateInfo?.name}
          Overall Score: ${evaluationResults?.overallScore}
          Recommendation: ${evaluationResults?.recommendation}
          
          Technical Skills: ${evaluationResults?.technicalSkills?.score}/10
          Problem Solving: ${evaluationResults?.problemSolving?.score}/10
          Communication: ${evaluationResults?.communication?.score}/10
          
          Strengths: ${evaluationResults?.strengths?.join(', ')}
          Areas for Improvement: ${evaluationResults?.areasForImprovement?.join(', ')}
          
          Provide encouraging, actionable feedback with specific learning resources and next steps.`
        }
      ],
      reasoning_effort: 'medium',
      verbosity: 'high',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'personalized_feedback',
          schema: {
            type: 'object',
            properties: {
              motivationalMessage: { type: 'string' },
              keyStrengths: {
                type: 'array',
                items: { type: 'string' }
              },
              developmentAreas: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    area: { type: 'string' },
                    recommendations: { type: 'array', items: { type: 'string' } },
                    resources: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['area', 'recommendations', 'resources']
                }
              },
              careerAdvice: { type: 'string' },
              nextSteps: {
                type: 'array',
                items: { type: 'string' }
              },
              estimatedTimeToImprovement: { type: 'string' }
            },
            required: ['motivationalMessage', 'keyStrengths', 'developmentAreas', 'careerAdvice', 'nextSteps', 'estimatedTimeToImprovement'],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating personalized feedback:', error);
    throw error;
  }
}