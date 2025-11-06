'use client'

import { TailoredCV } from '@/hooks/useTailorCv'
import { PDFDownloadLink, PDFViewer, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  tailored_cv: TailoredCV
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#000' },
  section: { marginBottom: 16 }, // spacing between sections
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subHeader: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 6, 
    paddingBottom: 2, 
    borderBottomWidth: 1, 
    borderBottomColor: '#000' // underline
  },
  subSection: { marginBottom: 8 }, // spacing between items in section
  bold: { fontWeight: 'bold' },
  smallText: { fontSize: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  techSkills: { marginTop: 2, fontStyle: 'italic', fontSize: 10 },
})

const CvPdfDocument = ({ tailored_cv }: Props) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.header}>{tailored_cv.personal_information.name || 'Candidate Name'}</Text>
        <Text style={styles.smallText}>
          {[
            tailored_cv.personal_information.email,
            tailored_cv.personal_information.phone,
            tailored_cv.personal_information.location,
          ]
            .filter(Boolean)
            .join(' • ')}
        </Text>
        <Text style={styles.smallText}>
          {[
            tailored_cv.personal_information.linkedin,
            tailored_cv.personal_information.github,
            tailored_cv.personal_information.portfolio,
          ]
            .filter(Boolean)
            .join(' • ')}
        </Text>
      </View>

      {/* Summary */}
      {tailored_cv.summary && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Professional Summary</Text>
          <Text>{tailored_cv.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {tailored_cv.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Professional Experience</Text>
          {tailored_cv.experience.map((exp, i) => (
            <View key={i} style={styles.subSection}>
              <View style={styles.row}>
                <Text style={styles.bold}>{exp.title}</Text>
                {exp.dates && <Text>{exp.dates}</Text>}
              </View>
              <View style={styles.row}>
                <Text>{exp.company}</Text>
                {exp.location && <Text>{exp.location}</Text>}
              </View>
              {exp.description && <Text>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {tailored_cv.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Education</Text>
          {tailored_cv.education.map((edu, i) => (
            <View key={i} style={styles.subSection}>
              <View style={styles.row}>
                <Text style={styles.bold}>{edu.degree}</Text>
                {edu.dates && <Text>{edu.dates}</Text>}
              </View>
              <View style={styles.row}>
                <Text>{edu.institution}</Text>
                {edu.location && <Text>{edu.location}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Technical Skills */}
      {Object.keys(tailored_cv.skills).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Technical Skills</Text>
          {Object.entries(tailored_cv.skills).map(([category, skills], i) =>
            skills.length > 0 ? (
              <View key={i} style={styles.subSection}>
                <Text style={styles.bold}>{category.replace(/_/g, ' ')}</Text>
                <Text style={styles.techSkills}>{skills.join(' • ')}</Text>
              </View>
            ) : null
          )}
        </View>
      )}

      {/* Projects */}
      {tailored_cv.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Notable Projects</Text>
          {tailored_cv.projects.map((project, i) => (
            <View key={i} style={styles.subSection}>
              <View style={styles.row}>
                <Text style={styles.bold}>{project.name}</Text>
                {project.dates && <Text>{project.dates}</Text>}
              </View>
              {project.organization && <Text>{project.organization}</Text>}
              <Text>{project.description}</Text>
              {project.technologies.length > 0 && <Text style={styles.techSkills}>Technologies: {project.technologies.join(', ')}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {tailored_cv.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Certifications</Text>
          {tailored_cv.certifications.map((cert, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.bold}>{cert.name}</Text>
              <Text style={styles.smallText}>
                {[cert.issuer, cert.date].filter(Boolean).join(' • ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Soft Skills */}
      {tailored_cv.soft_skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Professional Skills</Text>
          <Text>{tailored_cv.soft_skills.join(' • ')}</Text>
        </View>
      )}
    </Page>
  </Document>
)

export function CvTemplate({ tailored_cv }: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const doc = <CvPdfDocument tailored_cv={tailored_cv} />;

  return (
    <div className="space-y-4">
      {/* Download button */}
      <PDFDownloadLink
        document={doc}
        fileName={`${tailored_cv.personal_information.name?.replace(/\s+/g, '_').toLowerCase() || 'cv'}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Download PDF'}
          </Button>
        )}
      </PDFDownloadLink>

      {/* PDF Preview */}
      {isClient && (
        <PDFViewer width="100%" height={800}>
          {doc}
        </PDFViewer>
      )}
    </div>
  )
}
