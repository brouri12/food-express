#include "eleminer_etudiant.h"
#include "ui_eleminer_etudiant.h"

eleminer_etudiant::eleminer_etudiant(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::eleminer_etudiant)
{
    ui->setupUi(this);
}

eleminer_etudiant::~eleminer_etudiant()
{
    delete ui;
}
