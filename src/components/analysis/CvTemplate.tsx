'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Copy } from 'lucide-react'

export interface CvTemplateProps {
  tailoredCv: {
    personal_info: {
      name: string | null
      email: string | null
      phone: string | null
      location: string | null
      linkedin: string | null
      github: string | null
    }
    summary: string | null
    skills: Array<{
      name: string
      level: string | null
      category: string | null
    }>
    experience: Array<{
      job_title: string | null
      company: string | null
      start_date: string | null
      end_date: string | null
      duration: string | null
      location: string | null
      description: string
      skills_used: string[]
      achievements: string[]
    }>
    education: Array<{
      degree: string | null
      field_of_study: string | null
      institution: string | null
      start_date: string | null
      end_date: string | null
      gpa: string | null
      location: string | null
      achievements: string[]
    }>
    certifications: Array<{
      title: string
      issuer: string | null
      issue_date: string | null
      expiration_date: string | null
      credential_id: string | null
      url: string | null
    }>
    projects: Array<{
      name: string
      description: string
      technologies: string[]
      achievements: string[]
    }>
    languages: Array<{
      name: string
      proficiency: string
    }>
    raw_text: string
  }
}

export function CvTemplate({ tailoredCv }: CvTemplateProps) {
  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([tailoredCv.raw_text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'tailored-cv.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tailoredCv.raw_text)
      alert('CV copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tailored CV</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Personal Info */}
          {(tailoredCv.personal_info.name || tailoredCv.personal_info.email || tailoredCv.personal_info.phone) && (
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {tailoredCv.personal_info.name || 'Candidate Name'}
              </h2>
              <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
                {tailoredCv.personal_info.email && (
                  <span>{tailoredCv.personal_info.email}</span>
                )}
                {tailoredCv.personal_info.phone && (
                  <span>{tailoredCv.personal_info.phone}</span>
                )}
                {tailoredCv.personal_info.location && (
                  <span>{tailoredCv.personal_info.location}</span>
                )}
                {tailoredCv.personal_info.linkedin && (
                  <span>LinkedIn: {tailoredCv.personal_info.linkedin}</span>
                )}
                {tailoredCv.personal_info.github && (
                  <span>GitHub: {tailoredCv.personal_info.github}</span>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {tailoredCv.summary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed">{tailoredCv.summary}</p>
            </div>
          )}

          {/* Skills */}
          {tailoredCv.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {tailoredCv.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="border border-gray-300 px-3 py-1 rounded text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {tailoredCv.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Experience</h3>
              <div className="space-y-4">
                {tailoredCv.experience.map((exp, index) => (
                  <div key={index} className="pl-4 relative">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        {exp.job_title && (
                          <h4 className="font-semibold text-gray-800">{exp.job_title}</h4>
                        )}
                        {exp.company && (
                          <p className="text-gray-600">{exp.company}</p>
                        )}
                        {exp.location && (
                          <p className="text-gray-500 text-sm">{exp.location}</p>
                        )}
                      </div>
                      {(exp.start_date || exp.end_date) && (
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {exp.start_date} {exp.end_date && `- ${exp.end_date}`}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-gray-700">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                    {exp.skills_used.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Skills: </span>
                        {exp.skills_used.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {tailoredCv.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Education</h3>
              <div className="space-y-3">
                {tailoredCv.education.map((edu, index) => (
                  <div key={index} className="pl-4 relative">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-gray-400"></div>
                    {edu.degree && (
                      <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                    )}
                    {edu.field_of_study && (
                      <p className="text-gray-600">{edu.field_of_study}</p>
                    )}
                    {edu.institution && (
                      <p className="text-gray-600">{edu.institution}</p>
                    )}
                    {edu.location && (
                      <p className="text-gray-500 text-sm">{edu.location}</p>
                    )}
                    {(edu.start_date || edu.end_date) && (
                      <p className="text-sm text-gray-500">
                        {edu.start_date} {edu.end_date && `- ${edu.end_date}`}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                    )}
                    {edu.achievements.length > 0 && (
                      <ul className="mt-1 list-disc list-inside text-gray-700 text-sm">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {tailoredCv.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Certifications</h3>
              <ul className="list-disc list-inside space-y-1">
                {tailoredCv.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700">
                    {cert.title}
                    {cert.issuer && ` - ${cert.issuer}`}
                    {cert.issue_date && ` (${cert.issue_date})`}
                    {cert.credential_id && ` (ID: ${cert.credential_id})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {tailoredCv.projects && tailoredCv.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Projects</h3>
              <div className="space-y-3">
                {tailoredCv.projects.map((project, index) => (
                  <div key={index} className="pl-4 relative">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-gray-400"></div>
                    <h4 className="font-semibold text-gray-800">{project.name}</h4>
                    <p className="text-gray-700 text-sm">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-1">
                        <span className="text-sm text-gray-500">Technologies: </span>
                        {project.technologies.join(', ')}
                      </div>
                    )}
                    {project.achievements.length > 0 && (
                      <ul className="mt-1 list-disc list-inside text-gray-700 text-sm">
                        {project.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {tailoredCv.languages && tailoredCv.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Languages</h3>
              <div className="grid grid-cols-2 gap-2">
                {tailoredCv.languages.map((language, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700">{language.name}</span>
                    <span className="text-gray-500">{language.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Text Fallback */}
          {!tailoredCv.summary && tailoredCv.raw_text && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Curriculum Vitae</h3>
              <div className="bg-gray-50 p-4 rounded border">
                <pre className="text-gray-700 whitespace-pre-wrap">{tailoredCv.raw_text}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}